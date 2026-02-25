import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinner } from 'primeng/progressspinner';
import { LoaderService } from '@/interceptors/loaderservice';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

declare let gtag: any;

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    ToastModule,
    CommonModule
  ],
  template: `
    <p-toast key="global" position="top-center" [baseZIndex]="10000"></p-toast>
<div
  *ngIf="isLoading"
  class="zfc-loader fixed inset-0 flex items-center justify-center"
>
  <div class="zfc-text dune-font">
    <span>Z</span><span>Y</span><span>R</span><span>A</span>
  </div>
</div>

    <router-outlet></router-outlet>
  `,styles: [`
    .zfc-text span {
  opacity: 0;
  transform: translateY(20px);
  animation: reveal 0.6s ease-in-out infinite;
  font-size: 4rem; font-weight: 800; letter-spacing: 0.2em; display: flex; gap: 0.4rem;
   background: linear-gradient(90deg, #c9892b, #f5d77c, #c9892b); background-size: 200%;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; 
      
}

.zfc-text span:nth-child(1) { animation-delay: 0.3s; }
.zfc-text span:nth-child(2) { animation-delay: 0.6s; }
.zfc-text span:nth-child(3) { animation-delay: 0.9s; }
.zfc-text span:nth-child(4) { animation-delay: 1.2s; }

@keyframes goldFlow {
  0% { background-position: 0%; }
  100% { background-position: 200%; }
}

.zfc-loader {
  animation: fadeIn 4s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes reveal {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  40% {
    opacity: 1;
    transform: translateY(0);
  }
  80% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(20px);
  }
}

  `]
})
export class AppComponent implements OnInit, OnDestroy {
  isLoading = false;
  private loadingSub!: Subscription;
letters = ['Z', 'F', 'C'];
  constructor(
    private loaderService: LoaderService,
    private cdr: ChangeDetectorRef,private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-N9H6833QQL', {
          page_path: event.urlAfterRedirects,
        });
      }
    });
  }

  ngOnInit() {
    this.loadingSub = this.loaderService.loading$.subscribe((loading) => {
      //  Defer to avoid NG0100 error
      setTimeout(() => {
        this.isLoading = loading;
        this.cdr.markForCheck();
      });
    });

  }

  ngOnDestroy() {
    this.loadingSub?.unsubscribe();
  }
}
