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
    ProgressSpinner, // ✅ Make sure this is included
    CommonModule
  ],
  template: `
    <p-toast key="global" position="top-center" [baseZIndex]="10000"></p-toast>

    <!-- Spinner conditionally rendered -->
    <p-progressSpinner
  *ngIf="isLoading"
  styleClass="overlay-spinner"
  style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 9999;"
></p-progressSpinner>


    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit, OnDestroy {
  isLoading = false;
  private loadingSub!: Subscription;

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
