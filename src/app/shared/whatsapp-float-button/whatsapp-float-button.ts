import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription } from 'rxjs';
import { CartService, PurchaseType } from '@/pages/cart/cart.service';
import { StoreSettingsService } from '@/store-settings/store-settings.service';
import { JwtHelper } from '@/jwt/jwt-helper';

@Component({
  selector: 'app-whatsapp-float-button',
  standalone: true,
  imports: [CommonModule, TooltipModule],
  template: `
    @if (show) {
    <a
      [href]="whatsappUrl"
      target="_blank"
      rel="noopener"
      class="whatsapp-float"
      pTooltip="Wholesale enquiries on WhatsApp"
      tooltipPosition="left"
      aria-label="Chat with us on WhatsApp for wholesale enquiries"
    >
      <i class="pi pi-whatsapp"></i>
    </a>
    }
  `,
  styles: [`
    .whatsapp-float {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      width: 3.5rem;
      height: 3.5rem;
      background-color: #25D366;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 1.75rem;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.28);
      z-index: 9999;
      transition: transform 0.2s ease;
    }
    .whatsapp-float:hover {
      transform: scale(1.08);
    }
    @media (max-width: 640px) {
      .whatsapp-float {
        bottom: 1rem;
        right: 1rem;
        width: 3rem;
        height: 3rem;
        font-size: 1.5rem;
      }
    }
  `]
})
export class WhatsappFloatButton implements OnInit, OnDestroy {
  private purchaseType: PurchaseType = 'RETAIL';
  private sub?: Subscription;

  constructor(
    private cartService: CartService,
    private storeSettingsService: StoreSettingsService,
    private jwtHelper: JwtHelper
  ) {}

  ngOnInit() {
    this.sub = this.cartService.purchaseType$.subscribe((type) => {
      this.purchaseType = type;
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  get show(): boolean {
    if (this.purchaseType !== 'WHOLESALE') return false;
    const roles = this.jwtHelper.getUserRoles();
    return !(roles && roles.includes('ROLE_ADMIN'));
  }

  get whatsappUrl(): string {
    const digits = (this.storeSettingsService.current.supportPhone || '').replace(/\D/g, '');
    const storeName = this.storeSettingsService.current.storeName;
    const message = encodeURIComponent(`Hi, I'm interested in wholesale pricing at ${storeName}.`);
    return `https://wa.me/${digits}?text=${message}`;
  }
}
