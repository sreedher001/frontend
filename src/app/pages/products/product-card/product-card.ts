import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { Subscription } from 'rxjs';
import { Product } from '@/models/product.model';
import { ProductVariantResponseDto } from '@/models/productVariantResponseDto';
import { CartService, PurchaseType } from '@/pages/cart/cart.service';
import { CommonService } from '@/layout/service/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, ButtonModule, Tooltip],
  templateUrl: './product-card.html'
})
export class ProductCard implements OnInit, OnDestroy {
  @Input({ required: true }) product!: Product;
  @Input({ required: true }) variant!: ProductVariantResponseDto;
  @Input() inWishlist = false;
  @Input() isAdmin = false;

  @Output() open = new EventEmitter<void>();
  @Output() wishlistToggle = new EventEmitter<MouseEvent>();
  @Output() add = new EventEmitter<Event>();
  @Output() edit = new EventEmitter<MouseEvent>();
  @Output() remove = new EventEmitter<MouseEvent>();

  purchaseType: PurchaseType = 'RETAIL';
  private purchaseTypeSub!: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.purchaseTypeSub = this.cartService.purchaseType$.subscribe(type => {
      this.purchaseType = type;
    });
  }

  ngOnDestroy(): void {
    this.purchaseTypeSub?.unsubscribe();
  }

  get isWholesaleMode(): boolean {
    return this.purchaseType === 'WHOLESALE';
  }

  get isWholesaleAvailable(): boolean {
    return !!this.variant.wholesaleEnabled && !!this.variant.wholesalePrice;
  }

  get displayPrice(): number {
    if (this.isWholesaleMode && this.isWholesaleAvailable) {
      return this.variant.wholesalePrice;
    }
    return this.variant.retailPrice;
  }

  private commonService = new CommonService();

  get image(): string {
    const images = this.variant.productImage;
    const front = images?.find(img => img.viewType === 'front');
    return this.commonService.resolveImageUrl(front?.imageUrl || images?.[0]?.imageUrl);
  }

  get packLabel(): string {
    return this.variant.weight && this.variant.unit ? `${this.variant.weight} ${this.variant.unit}` : '';
  }

  get hasDiscount(): boolean {
    return !this.isWholesaleMode && !!this.variant.mrp && this.variant.mrp > this.variant.retailPrice;
  }

  get discountAmount(): number {
    if (!this.hasDiscount || !this.variant.mrp) return 0;
    return Math.round(this.variant.mrp - this.variant.retailPrice);
  }

  get discountPercent(): number {
    if (!this.hasDiscount || !this.variant.mrp) return 0;
    return Math.round(((this.variant.mrp - this.variant.retailPrice) / this.variant.mrp) * 100);
  }
}
