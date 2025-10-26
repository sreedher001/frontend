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
  class="zfc-loader fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-md z-50"
>
  <div class="zfc-text dune-font">
    <span>Z</span><span>F</span><span>C</span>
  </div>
</div>

    <router-outlet></router-outlet>
  `,styles: [`
    .zfc-text {
      
  font-size: 4rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  display: flex;
  gap: 0.4rem;
  background: linear-gradient(90deg, #c9892b, #f5d77c, #c9892b);
  background-size: 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: goldFlow 3s linear infinite;
}

@keyframes goldFlow {
  0% { background-position: 0%; }
  100% { background-position: 200%; }
}

.zfc-loader {
  animation: fadeIn 0.4s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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
