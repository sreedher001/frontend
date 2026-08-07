import { LoginService } from '@/pages/auth/login.service';
import { StoreSettingsService } from '@/store-settings/store-settings.service';
import { Category, ProductService } from '@/pages/products/product.service';
import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ResolveImagePipe } from '@/shared/resolve-image.pipe';

@Component({
    standalone: true,
    selector: 'app-footer',
    imports:[RouterModule,FormsModule,CommonModule,ResolveImagePipe],
    template: `<footer class="bg-[var(--p-primary-color)] text-white py-12 px-6 md:px-16">
  <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

    <!-- Branding -->
    <div>
      <a routerLink="/" class="flex items-center gap-2">
        @if(storeSettingsService.current.logoUrl && storeSettingsService.current.logoUrl !== 'assets/images/logo.png'){
        <img [src]="storeSettingsService.current.logoUrl | resolveImage" [alt]="storeSettingsService.current.storeName" class="w-[90px] h-[77px] object-contain" />
        }
        <span class="text-2xl font-semibold tracking-wide text-white hover:underline brand-font">{{ storeSettingsService.current.storeName }}</span>
      </a>
      @if (storeSettingsService.current.tagline) {
      <p class="text-white/70 italic mt-2">{{ storeSettingsService.current.tagline }}</p>
      }
      @if (storeSettingsService.current.supportEmail) {
      <p class="text-white/80 text-sm mt-4">{{ storeSettingsService.current.supportEmail }}</p>
      }
      @if (storeSettingsService.current.supportPhone) {
      <p class="text-white/80 text-sm mt-1">{{ storeSettingsService.current.supportPhone }}</p>
      }
    </div>

    <!-- Company -->
    <div>
      <h3 class="text-sm font-semibold uppercase tracking-wide text-white mb-4">Company</h3>
      <ul class="space-y-2 text-sm text-white/80">
        <li><a [routerLink]="['/home']" fragment="about" class="hover:underline hover:text-[var(--p-primary-100)] transition-colors duration-150">About Us</a></li>
        <li><a [routerLink]="['/home']" fragment="contact" class="hover:underline hover:text-[var(--p-primary-100)] transition-colors duration-150">Contact Us</a></li>
        <li><a [routerLink]="['/home']" fragment="wholesale" class="hover:underline hover:text-[var(--p-primary-100)] transition-colors duration-150">Wholesale</a></li>
        <li><a routerLink="/terms-and-conditions" class="hover:underline hover:text-[var(--p-primary-100)] transition-colors duration-150">Terms &amp; Conditions</a></li>
      </ul>
    </div>

    <!-- Shop -->
    <div>
      <h3 class="text-sm font-semibold uppercase tracking-wide text-white mb-4">Shop</h3>
      <ul class="space-y-2 text-sm text-white/80">
        <li><a routerLink="/search" class="hover:underline hover:text-[var(--p-primary-100)] transition-colors duration-150">All Products</a></li>
        @for(cat of topLevelCategories; track cat.id) {
        <li><a (click)="goToCategory(cat)" class="hover:underline hover:text-[var(--p-primary-100)] transition-colors duration-150 cursor-pointer">{{ cat.name }}</a></li>
        }
      </ul>
    </div>

    <!-- Connect -->
    <div>
      <h3 class="text-sm font-semibold uppercase tracking-wide text-white mb-4">Follow Us On</h3>
      <div class="flex gap-3 mb-6">
        @if (storeSettingsService.current.facebookUrl) {
        <a [href]="storeSettingsService.current.facebookUrl" target="_blank" rel="noopener" aria-label="Facebook"
          class="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition">
          <i class="pi pi-facebook"></i>
        </a>
        }
        @if (storeSettingsService.current.instagramUrl) {
        <a [href]="storeSettingsService.current.instagramUrl" target="_blank" rel="noopener" aria-label="Instagram"
          class="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition">
          <i class="pi pi-instagram"></i>
        </a>
        }
        @if (storeSettingsService.current.twitterUrl) {
        <a [href]="storeSettingsService.current.twitterUrl" target="_blank" rel="noopener" aria-label="Twitter"
          class="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition">
          <i class="pi pi-twitter"></i>
        </a>
        }
        @if (storeSettingsService.current.linkedinUrl) {
        <a [href]="storeSettingsService.current.linkedinUrl" target="_blank" rel="noopener" aria-label="LinkedIn"
          class="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition">
          <i class="pi pi-linkedin"></i>
        </a>
        }
      </div>

      <h3 class="text-sm font-semibold uppercase tracking-wide text-white mb-3">Stay in Touch</h3>
      <form (submit)="subscribeNewsletter($event)">
        <div class="flex">
          <input
            type="email"
            id="email"
            [(ngModel)]="subscriberEmail"
            name="subscriberEmail"
            placeholder="you@example.com"
            required
            class="w-full px-3 py-2 bg-white/10 border border-white/30 placeholder-white/60 text-white text-sm focus:outline-none rounded-l" />
          <button
            type="submit"
            class="px-4 py-2 bg-black text-white text-sm uppercase tracking-wide hover:opacity-90 rounded-r">
            Join
          </button>
        </div>
        @if(show){<div class="mt-3 text-sm text-white/90">Thank you for subscribing!</div>}
      </form>
    </div>

  </div>

  <!-- Divider -->
  <div class="border-t border-white/20 mt-10 pt-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/70">
    <p>&copy; {{ currentYear }} {{ storeSettingsService.current.storeName }}. All Rights Reserved.</p>

    <div class="flex flex-wrap justify-center gap-x-4 gap-y-1">
      <a routerLink="/terms-and-conditions" fragment="delivery" class="hover:underline hover:text-[var(--p-primary-100)] transition-colors duration-150">Delivery</a>
      <a routerLink="/terms-and-conditions" fragment="returns" class="hover:underline hover:text-[var(--p-primary-100)] transition-colors duration-150">Refunds</a>
      <a routerLink="/terms-and-conditions" fragment="cancellation" class="hover:underline hover:text-[var(--p-primary-100)] transition-colors duration-150">Cancellation</a>
      <a routerLink="/terms-and-conditions" fragment="returns" class="hover:underline hover:text-[var(--p-primary-100)] transition-colors duration-150">Returns</a>
      <a routerLink="/terms-and-conditions" class="hover:underline hover:text-[var(--p-primary-100)] transition-colors duration-150">Terms &amp; Conditions</a>
      <a routerLink="/terms-and-conditions" fragment="privacy" class="hover:underline hover:text-[var(--p-primary-100)] transition-colors duration-150">Privacy Policy</a>
    </div>
  </div>
</footer>

<!-- Floating Action Buttons -->
@if (storeSettingsService.current.supportPhone) {
<a [href]="whatsappLink" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"
  class="fixed bottom-6 right-6 z-[999] w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
  <i class="pi pi-whatsapp text-2xl"></i>
</a>
}

@if (showBackToTop) {
<button type="button" (click)="scrollToTop()" aria-label="Back to top"
  [class]="(storeSettingsService.current.supportPhone ? 'bottom-24' : 'bottom-6') + ' fixed right-6 z-[999] w-11 h-11 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform'">
  <i class="pi pi-arrow-up"></i>
</button>
}
`
})
export class AppFooter implements OnInit {
show=false;
subscriberEmail: string = '';
topLevelCategories: Category[] = [];
showBackToTop = false;

constructor(private newsletterService: LoginService, public storeSettingsService: StoreSettingsService,
  private productService: ProductService, private router: Router) {}

    currentYear: number = new Date().getFullYear();

    ngOnInit(): void {
      this.productService.getAllCategories().subscribe({
        next: (cats) => this.topLevelCategories = cats.filter(c => c.parentId == null),
        error: () => this.topLevelCategories = []
      });
    }

    get whatsappLink(): string {
      const digits = (this.storeSettingsService.current.supportPhone || '').replace(/\D/g, '');
      return `https://wa.me/${digits}`;
    }

    goToCategory(category: Category) {
      this.router.navigate(['/search'], { queryParams: { categoryName: category.name } });
    }

    @HostListener('window:scroll')
    onWindowScroll() {
      this.showBackToTop = window.scrollY > 400;
    }

    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    subscribeNewsletter(event: Event){
        event.preventDefault();
const email = this.subscriberEmail.trim();
    if (!email) return;

    console.log('Subscribing email:', email);

    this.newsletterService.subscribeNewsletter(email).subscribe({
      next: (res:any) => {
        console.log('Subscription successful:', res);
        this.show = true;
        this.subscriberEmail = '';
      },
      error: (err:any) => {
        console.error('Subscription failed:', err);
        this.show = true;
        // Optionally handle error UI
      }
    });
  }

}
