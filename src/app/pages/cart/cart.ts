import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CartService } from './cart.service';
import { CardModule } from 'primeng/card';
import { BehaviorSubject } from 'rxjs';
import { CartItemDto, CartResponse, PurchaseType } from './cart.model';
import { CommonModule, DecimalPipe, NgClass } from '@angular/common';
import { Product } from '@/models/product.model';
import { Products } from '../products/products';
import { Productdetails } from '../productdetails/productdetails';
import { ProductService } from '../products/product.service';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { Router } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { Message, MessageModule } from "primeng/message";
import { LoginComponent } from "../auth/login";
import { Signup } from "../auth/signup/signup";
import { firstValueFrom } from 'rxjs';
import confetti from 'canvas-confetti';
import lottie from 'lottie-web';
import { ResolveImagePipe } from '@/shared/resolve-image.pipe';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [ButtonModule, CommonModule, FormsModule, BadgeModule, CardModule, DecimalPipe, TagModule, ButtonModule, MessageModule, ResolveImagePipe],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit {

  showSignupPanel = false;
  showLogin = false;
  shippingFee: number = 0;
  couponSuccess = false;
showCouponStamp = false;
  @ViewChild('cartPanel', { static: false }) cartPanel!: ElementRef;
  @ViewChild('couponAnimation') couponAnimation!: ElementRef;
  product: Product | undefined;
  // products : Products[]=[];
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();
  cart: CartResponse = {
    cartId: 0,
    shippingFee: 0,
    totalAmount: 0,
    appliedPromotions: [],
    availableCoupons: [],
    lockedCoupons: [],
    items: [],
    purchaseType: 'RETAIL' as PurchaseType
  };
  isLoggedIn: boolean = false;
  sizeOptions: any[] = [];
  couponAnim: any;

  couponCode = '';
  appliedCoupon: string | null = null;
  discount = 0;
  couponError = '';
  showCouponsPanel = true;
  showLockedCouponsPopup = false;


  relatedProducts: Product[] = [];
remainingTime: number = 0;
  displayTime: string = '';
  interval: any;
  

  constructor(private cartService: CartService, private productDetails: Productdetails, private prod: Products,
    private productService: ProductService, private messageService: MessageService, private router: Router,private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem("isLoggedIn") === "true") {
      this.isLoggedIn = true;
    }
    this.loadCart();

    this.cartService.cartRefresh$.subscribe(() => {
  // if (localStorage.getItem("isLoggedIn") !== "true") {
  //   this.buildCartFromGuest();
  // }
});

     let savedEndTime = localStorage.getItem('saleEndTime');
  const now = Date.now();

  if (savedEndTime) {
    this.remainingTime = +savedEndTime - now;

    // If timer expired, reset it for another 3 hours
    if (this.remainingTime <= 0) {
      const newEndTime = now + 3 * 60 * 60 * 1000; // 3 hours
      localStorage.setItem('saleEndTime', newEndTime.toString());
      this.remainingTime = 3 * 60 * 60 * 1000;
    }
  } else {
    const endTime = now + 3 * 60 * 60 * 1000; // 3 hours
    localStorage.setItem('saleEndTime', endTime.toString());
    this.remainingTime = 3 * 60 * 60 * 1000;
  }

  this.startTimer();
    

  }

  startTimer() {
    this.interval = setInterval(() => {
      this.remainingTime -= 1000;

      if (this.remainingTime <= 0) {
        clearInterval(this.interval);
        this.displayTime = '00h : 00m : 00s';
        return;
      }

      this.displayTime = this.formatTime(this.remainingTime);
    }, 1000);
  }

  formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${this.pad(hours)}h : ${this.pad(minutes)}m : ${this.pad(seconds)}s`;
  }

  pad(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
  // ---------- Helper functions for guest cart ----------
  private guestCartKey = 'guestCart';

  private getGuestCartRaw(): any[] {
    try {
      return JSON.parse(localStorage.getItem(this.guestCartKey) || '[]') || [];
    } catch {
      return [];
    }
  }

  private saveGuestCartRaw(arr: any[]) {
    localStorage.setItem(this.guestCartKey, JSON.stringify(arr || []));
  }

  /**
   * Normalize a raw guest item into the format your UI expects.
   * Ensures variantId, sizeId, selectedSizeObj, total and imageUrl exist.
   */
  private normalizeGuestItem(raw: any) {
    return {
      // id for UI uses productId/id sometimes — keep both to be safe
      id: raw.variantId ?? raw.id ?? 0,
      variantId: raw.variantId ?? raw.id ?? raw.productId ?? 0,
      productId: raw.variantId ?? raw.productId ?? raw.id ?? 0,
      variantName: raw.variantName ?? raw.name ?? '',
      quantity: raw.quantity ?? 1,
      size: raw.size ?? (raw.selectedSizeObj?.size) ?? null,
      sizeId: raw.sizeId ?? raw.selectedSizeObj?.sizeId ?? null,
      color: raw.color ?? null,
      price: raw.price ?? (raw.selectedSizeObj?.price) ?? 0,
      originalPrice: raw.originalPrice ?? (raw.selectedSizeObj?.originalPrice) ?? 0,
      discount: raw.discount ?? (raw.selectedSizeObj?.discount) ?? 0,
      discountPercentage: raw.discountPercentage ?? (raw.selectedSizeObj?.discountPercentage) ?? 0,
      availableQuantity: raw.availableQuantity ?? (raw.selectedSizeObj?.availableQuantity) ?? 1,
      imageUrl: raw.imageUrl ?? raw.productImage ?? '',
      // keep array of size options (minimal)
      sizeOptions: raw.sizeOptions ?? [raw.selectedSizeObj ?? {
        size: raw.size,
        sizeId: raw.sizeId,
        price: raw.price,
        discountPercentage: raw.discountPercentage,
        availableQuantity: raw.availableQuantity ?? 1
      }],
      selectedSizeObj: raw.selectedSizeObj ?? {
        size: raw.size,
        sizeId: raw.sizeId,
        price: raw.price,
        discountPercentage: raw.discountPercentage,
        availableQuantity: raw.availableQuantity ?? 1
      },
      total: (() => {
        const p = raw.price ?? (raw.selectedSizeObj?.price) ?? 0;
        const d = raw.discountPercentage ?? (raw.selectedSizeObj?.discountPercentage) ?? 0;
        const qty = raw.quantity ?? 1;
        const final = Math.round(p - (p * d / 100));
        return final * qty;
      })()
    };
  }

  /**
   * Rebuilds this.cart.items from guest localStorage (normalizing).
   */
  private buildCartFromGuest() {
    const raw = this.getGuestCartRaw();
    this.cart = {
      cartId: 0,
      shippingFee: 0,
      totalAmount: 0,
      appliedPromotions: [],
      availableCoupons: [],
      lockedCoupons: [],

      items: raw.map(r => ({
        ...this.normalizeGuestItem(r)
      })),
      purchaseType: (localStorage.getItem('purchaseType') as PurchaseType) || 'RETAIL'
    };
  }




  // loadCart(): void {
  //   const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  //   if (isLoggedIn) {
  //     this.cartService.getCart().subscribe({
  //       next: (res) => {
  //         this.cart = res;
  //         this.cart.items.forEach((item) => {
  //           item.sizeOptions = item.availableSizes;
  //           item.selectedSizeObj = item.sizeOptions.find((opt: any) => opt.size === item.size);
  //         });
  //       },
  //       error: (err) => {
  //         console.error('Failed to load cart', err);
  //       }
  //     });
  //   } else {
  //     // Guest: rebuild with normalized shape
  //     this.buildCartFromGuest();
  //   }
  // }


  // loadCart(): void {
  //   const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  //   if (isLoggedIn) {
  //     this.cartService.cart$.subscribe({
  //       next: (res) => {
  //         if (!res) return
  //         this.cart = res;
  //         this.cart.items.forEach((item) => {
  //           item.sizeOptions = item.availableSizes;
  //           item.selectedSizeObj = item.sizeOptions.find((opt: any) => opt.size === item.size);
  //         });
  //       },
  //       error: (err) => {
  //         console.error('Failed to load cart', err);
  //       }
  //     });
  //   } else {
  //     // Guest: rebuild with normalized shape
  //     this.buildCartFromGuest();
      
  //   }
  // }

  loadCart(): void {
  this.cartService.cart$.subscribe({
    next: (res) => {
      if (!res) return;

      this.cart = res;
    }
  });

  this.cartService.getCart().subscribe();
}

  
  //for guest cart
  calculateItemTotal(item: any): number {
    const price = item.price;
    const discount = item.discountPercentage || 0;
    const finalPrice = price - (price * discount / 100);
    return finalPrice * item.quantity;
  }


  goToProductDetails(variantId: number): void {
    this.router.navigate(['/product-details', variantId]);
  }


  // getRelatedProductsByCategory(id: number): void {
  //   this.productService.getProductById(id).subscribe({
  //     next: (res) => {
  //       this.product = res;

  //       this.productService.getRelatedProductsByCategory(this.product.category, 0, 10).subscribe({
  //         next: (res) => {
  //           this.relatedProducts = res.content;
  //         },
  //         error: (err) => {
  //           console.error('Failed to fetch related products:', err);
  //         }
  //       });
  //     },
  //     error: (err) => {
  //       console.error('Failed to fetch product details:', err);
  //     }
  //   });
  // }

  goToShop() {
    this.router.navigate(['/products']);
    this.cartService.closeDrawer();
  }

  // getCartTotal(): number {
  //   return this.cart.items.reduce((total: number, item: any) => total + item.total, 0);
  // }
  getCartSubtotal(): number {
    return this.cart.items.reduce(
      (total: number, item: any) => total + item.total,
      0
    );
  }

  getShippingFee(): number {
    return this.cart.shippingFee;
  }

  getFinalTotal(): number {
    return this.cart.totalAmount;;
  }

  goToCheckout(): void {
    if (this.isLoggedIn) {
      this.cartService.closeDrawer();
      this.router.navigate(['/checkout']);
    }
    else {
     // this.toggleSignupPanel();
      this.router.navigate(['/auth/login']);
      this.cartService.closeDrawer();
    }
  }
  removeItem(productId: number): void {
    this.cartService.removeItem(productId).subscribe(() => {
      this.cart.items = this.cart.items.filter((i: any) => i.productId !== productId);
    });
  }

  checkout(): void {
    // navigate or trigger payment
    console.log('Proceed to checkout');
  }
  updateCartCount(count: number) {
    this.cartCountSubject.next(count);
  }
  

  // increaseQuantity(item: any) {
  //   if (!this.isLoggedIn) {
  //     this.showSignupPanel = true;
  //     return;
  //   }

  //   const sizeInfo = item.sizeOptions?.find(
  //     (s: any) => s.size === item.size
  //   );

  //   if (!sizeInfo) {
  //     this.messageService.add({
  //       key: 'global',
  //       severity: 'error',
  //       summary: 'Size Info Missing',
  //       detail: 'Cannot find stock info for selected size.',
  //       life: 3000
  //     });
  //     return;
  //   }

  //   if (item.quantity >= sizeInfo.availableQuantity) {
  //     this.messageService.add({
  //       key: 'global',
  //       severity: 'warn',
  //       summary: 'Stock Limit Reached',
  //       detail: `Only ${sizeInfo.availableQuantity} items available.`,
  //       life: 3000
  //     });
  //     return;
  //   }

  //   const nextQty = item.quantity + 1;
  //   this.updateCartItem(item, nextQty);
  // }


  // decreaseQuantity(item: any) {
  //   if (!this.isLoggedIn) {
  //     this.showSignupPanel=true;
  //     return;
  //   }

  //   if (item.quantity > 1) {
  //     item.quantity--;
  //     this.updateCartItem(item);
  //   }
  // }

  increaseQuantity(item: any) {

  if (item.availableQuantity != null && item.quantity >= item.availableQuantity) {
    this.messageService.add({
      key: 'global',
      severity: 'warn',
      summary: 'Stock Limit',
      detail: `Only ${item.availableQuantity} available`,
    });
    return;
  }

  const nextQty = item.quantity + 1;

  this.updateCartItem(item, nextQty);
}

  decreaseQuantity(item: any) {
    

    if (item.quantity <= 1) return;

    const nextQty = item.quantity - 1;
    this.updateCartItem(item, nextQty);
  }



  // updateCartItem(item: any, newQuantity: number) {
  //   if (localStorage.getItem("isLoggedIn") === "true") {
  //     // Logged-in: call backend
  //     this.cartService.updateCartItem(item.id, newQuantity, item.size, item.sizeId)
  //       .subscribe({
  //         next: (res: any) => {
  //           console.log('Cart updated:', res);
  //           // prefer to update UI without full reload - but for now refresh:
  //           //window.location.reload();
  //           // const index = this.cart.items.findIndex((i: any) => i.id === item.id);
  //           // if (index > -1) {
  //           //   this.cart.items[index].quantity = item.quantity;
  //           //   this.cart.items[index].total = item.price * item.quantity;
  //           // }
  //           this.cartService.getCart().subscribe();

  //         },
  //         error: (err: any) => {
  //           console.error('Update failed:', err);
  //         }
  //       });
  //   } else {
  //     // Guest: update localStorage
  //     const guestCart = this.getGuestCartRaw();
  //     const idx = guestCart.findIndex((ci: any) => {
  //       const ciVariant = ci.variantId ?? ci.id ?? ci.productId;
  //       const ciSizeId = ci.sizeId ?? ci.size?.sizeId ?? ci.size;
  //       const itemVariant = item.variantId ?? item.id ?? item.productId;
  //       const itemSizeId = item.sizeId ?? item.selectedSizeObj?.sizeId ?? item.size;
  //       return (ciVariant === itemVariant) && (ciSizeId === itemSizeId);
  //     });

  //     if (idx >= 0) {
  //       // update quantity & total
  //       guestCart[idx].quantity = item.quantity;
  //       // keep price/discount etc as they are
  //       this.saveGuestCartRaw(guestCart);
  //       this.buildCartFromGuest();
  //     } else {
  //       // item not found — fallback: search by variant then update that
  //       const byVariant = guestCart.find((ci: any) => (ci.variantId ?? ci.id ?? ci.productId) === (item.variantId ?? item.id));
  //       if (byVariant) {
  //         byVariant.quantity = item.quantity;
  //         this.saveGuestCartRaw(guestCart);
  //         this.buildCartFromGuest();
  //       } else {
  //         console.warn('Guest cart item to update not found', item);
  //       }
  //     }
  //   }
  // }
  updateCartItem(item: any, newQuantity: number) {

  this.cartService
    .updateCartItem(item.id, newQuantity)
    .subscribe({
      next: () => {
        this.cartService.getCart().subscribe();
      },
      error: (err) => console.error(err)
    });
}

  // removeFromCart(item: any): void {
  //   if (this.isLoggedIn) {
  //     // Logged-in: remove from backend
  //     this.cartService.removeItem(item.id).subscribe({
  //       next: () => {
  //         this.cart.items = this.cart.items.filter(i => i.id !== item.id);
  //         this.messageService.add({
  //           key: 'global',
  //           severity: 'success',
  //           summary: 'Removed',
  //           icon: 'pi pi-trash',
  //           detail: `${item.variantName} removed from cart.`
  //         });
  //       },
  //       error: () => {
  //         this.messageService.add({
  //           key: 'global',
  //           severity: 'danger',
  //           summary: 'Failed to remove!',
  //           icon: 'pi pi-times'
  //         });
  //       }
  //     });
  //   } else {
  //     // Guest: remove from localStorage
  //     const guestCart = this.getGuestCartRaw();

  //     // Remove matching variant + sizeId (use size & sizeId both)
  //     const updatedCart = guestCart.filter((ci: any) => {
  //       const ciVariant = ci.variantId ?? ci.id ?? ci.productId;
  //       const ciSizeId = ci.sizeId ?? ci.size?.sizeId ?? ci.sizeId;
  //       const itemVariant = item.variantId ?? item.id ?? item.productId;
  //       const itemSizeId = item.sizeId ?? item.selectedSizeObj?.sizeId ?? item.size;

  //       // compare both variant and size (fallback to size string comparision)
  //       const variantMatch = (ciVariant === itemVariant);
  //       const sizeMatch = (ciSizeId != null && itemSizeId != null) ? (ciSizeId === itemSizeId) : (ci.size === item.size);
  //       return !(variantMatch && sizeMatch);
  //     });

  //     // Save back and rebuild UI
  //     this.saveGuestCartRaw(updatedCart);
  //     this.buildCartFromGuest();
  //     this.cartService.removeGuestItem(item.variantId, item.sizeId);
  //     this.messageService.add({
  //       key: 'global',
  //       severity: 'success',
  //       summary: 'Removed',
  //       icon: 'pi pi-trash',
  //       detail: `${item.variantName} removed from cart.`
  //     });
  //   }
  // }

  removeFromCart(item: any): void {

  this.cartService.removeItem(item.id).subscribe({
    next: () => {
      this.cartService.getCart().subscribe();

      this.messageService.add({
        key: 'global',
        severity: 'success',
        summary: 'Removed',
        detail: `${item.variantName} removed`
      });
    }
  });
}
  get hasCartItems(): boolean {
    return this.cart.items.length > 0;
  }

  rebuildGuestCartItems(cart: any[]): any[] {
    return cart.map(item => ({
      ...item,
      selectedSizeObj: {
        size: item.size,
        sizeId: item.sizeId,
        availableQuantity: item.availableQuantity ?? 1 // Default if missing
      }
    }));
  }

  toggleSignupPanel() {
    this.showSignupPanel = !this.showSignupPanel;

    // Optional: reset to signup when panel opens
    if (this.showSignupPanel) {
      this.showLogin = false;
    }
  }

  async handleLoginSuccess($event: any) {
    if ($event) {
      this.isLoggedIn = true;
      this.showSignupPanel = false;

      const guestCart = this.getGuestCartRaw();

      if (guestCart.length) {
        try {
          for (const item of guestCart) {
            await firstValueFrom(
              this.cartService.addToCart({
                variantId: item.variantId,
                quantity: item.quantity,
                purchaseType: 'RETAIL' as PurchaseType
              })
            );
          }

          localStorage.removeItem(this.guestCartKey);
          this.loadCart();

          setTimeout(() => window.location.reload(), 300);
        } catch (err) {
          console.error('Cart merge failed:', err);
        }
      } else {
        window.location.reload();
      }
    }
  }

  toggleLogin() {
    this.showLogin = !this.showLogin;
  }

  // applyCoupon(couponCode: string) {

  //   this.couponError = '';

  //   this.cartService.applyCoupon(couponCode)
  //   .subscribe({
  //     next: (res:any) => {

  //       this.cart = res;

  //       // rebuild UI state
  //       this.cart.items.forEach((item:any) => {
  //         item.sizeOptions = item.availableSizes;
  //         item.selectedSizeObj = item.sizeOptions.find(
  //           (opt:any) => opt.size === item.size
  //         );
  //       });

  //       this.appliedCoupon = res.appliedCoupon;
  //       this.discount = res.discount;

  //       this.couponCode = '';
  //     },
  //     error: (err) => {
  //       this.couponError = err.error?.message || 'Invalid coupon';
  //     }
  //   });
  // }

  applyCoupon(couponCode: string) {

  this.couponError = '';

  this.cartService.applyCoupon(couponCode)
    .subscribe({
      next: (res: any) => {

        this.cart = res;

        this.appliedCoupon = res.appliedCoupon;
        this.discount = res.discount;

        this.couponCode = '';

        if (this.discount > 0) {

  this.couponSuccess = true;
this.showCouponStamp = true;
setTimeout(() => {
  if (this.couponAnimation) {

    this.couponAnim = lottie.loadAnimation({
      container: this.couponAnimation.nativeElement,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: 'assets/animations/coupon-success.json'
    });

  }
}, 10);
  
  const canvas = document.createElement('canvas');

  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';

  this.cartPanel.nativeElement.appendChild(canvas);

  const myConfetti =confetti.create(canvas, {
    resize: true,
    useWorker: true
  });

  // LEFT burst
myConfetti({
  particleCount: 70,
  spread: 100,
  startVelocity: 45,
  gravity: 0.7,
  origin: { x: 0.1, y: 0.3 }
});

// RIGHT burst
myConfetti({
  particleCount: 70,
  spread: 100,
  startVelocity: 45,
  gravity: 0.7,
  origin: { x: 0.9, y: 0.3 }
});

 setTimeout(() => {

  canvas.remove();
this.couponSuccess = false;
  this.showCouponStamp = false;
  if(this.couponAnim){
    this.couponAnim.destroy();
  }
  this.cd.detectChanges();
}, 3000);
}

      },
      error: (err) => {
        this.couponError = err.error?.message || 'Invalid coupon';
      }
    });
}
getEstimatedDelivery() {
  const today = new Date();
  const estimatedDate = new Date(today);

  estimatedDate.setDate(today.getDate() + 8); // add 8 days

  return estimatedDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short'
  });
}
  removeCoupon() {

    this.cartService.removeCoupon()
      .subscribe(res => {

        this.cart = res;

        this.appliedCoupon = null;
        this.discount = 0;

      });

  }
  showCouponsPanelToggle() {
    this.showCouponsPanel = !this.showCouponsPanel;
  }

}
