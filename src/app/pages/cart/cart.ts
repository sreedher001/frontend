import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CartService } from './cart.service';
import { CardModule } from 'primeng/card';
import { BehaviorSubject } from 'rxjs';
import { CartItemDto, CartResponse } from './cart.model';
import { DecimalPipe, NgClass } from '@angular/common';
import { Product } from '@/models/product.model';
import { Products } from '../products/products';
import { Productdetails } from '../productdetails/productdetails';
import { ProductService } from '../products/product.service';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { Router } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { Message, MessageModule } from "primeng/message";
import { LoginComponent } from "../auth/login";
import { Signup } from "../auth/signup/signup";
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone:true,
  imports: [ButtonModule, NgClass, FormsModule, BadgeModule, CardModule, DecimalPipe, TagModule, AutoCompleteModule, ButtonModule, MessageModule, LoginComponent, Signup],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit {

  showSignupPanel = false;
showLogin = false;


  product: Product | undefined ;
  // products : Products[]=[];
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();
  cart: CartResponse = {
    cartId: 0,
    items: []
  };
  isLoggedIn:boolean =false;
  sizeOptions:any[]=[];

autoFilteredSizeValue: any[] = [];
  
  relatedProducts: Product[] = [];

  constructor(private cartService: CartService,private productDetails:Productdetails,private prod : Products,
    private productService:ProductService,private messageService: MessageService,private router: Router
  ) { }

  ngOnInit(): void {
    if(localStorage.getItem("isLoggedIn")==="true"){
      this.isLoggedIn=true;}
    this.loadCart();

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
    discountPercentage: raw.discountPercentage ?? (raw.selectedSizeObj?.discountPercentage) ?? 0,
    availableQuantity: raw.availableQuantity ?? (raw.selectedSizeObj?.availableQuantity) ?? 1,
    imageUrl: raw.imageUrl ?? raw.productImage ?? '',
    // keep array of size options (minimal)
    sizeOptions: raw.sizeOptions ?? [ raw.selectedSizeObj ?? {
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
    total: ( () => {
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
    items: raw.map(r => ({
      ...this.normalizeGuestItem(r),
      availableSizes: r.availableSizes || [],
      filteredSizeOptions: r.filteredSizeOptions || []
    }))
  };
}



  getItemLength(item: CartItemDto) {
return item?.availableSizes?.length;
}


loadCart(): void {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (isLoggedIn) {
    this.cartService.getCart().subscribe({
      next: (res) => {
        this.cart = res;
        this.cart.items.forEach((item) => {
          item.sizeOptions = item.availableSizes;
          item.selectedSizeObj = item.sizeOptions.find((opt: any) => opt.size === item.size);
        });
      },
      error: (err) => {
        console.error('Failed to load cart', err);
      }
    });
  } else {
    // Guest: rebuild with normalized shape
    this.buildCartFromGuest();
  }
}

//for guest cart
calculateItemTotal(item: any): number {
  const price = item.price;
  const discount = item.discountPercentage || 0;
  const finalPrice = price - (price * discount / 100);
  return finalPrice * item.quantity;
}


 filterSize(event: AutoCompleteCompleteEvent,item:any) {
    const query = event.query;
    const filtered: any[] = [];

    for (let i = 0; i < (item.sizeOptions as any[]).length; i++) {
      const sizeItem = (item.sizeOptions as any[])[i];
      if (sizeItem.size.toLowerCase().indexOf(query.toLowerCase()) == 0 && sizeItem.availableQuantity>0) {
        filtered.push(sizeItem);
      }
    }

    this.autoFilteredSizeValue = filtered;
  }

  preventTyping(event: KeyboardEvent): void {
  event.preventDefault();
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
}

  getCartTotal(): number {
    return this.cart.items.reduce((total: number, item: any) => total + item.total, 0);
  }

   goToCheckout(): void {
    if(this.isLoggedIn){
      this.router.navigate(['/checkout']);
    }
  else{
    this.toggleSignupPanel();
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
increaseQuantity(item: any) {
  if (!this.isLoggedIn) {
    this.showSignupPanel=true;
    return;
  }

  const selectedSize = item.size;
  const sizeInfo = item.sizeOptions.find(
    (size: any) => size.size === selectedSize
  );

  if (!sizeInfo) {
    this.messageService.add({
      key: 'global',
      severity: 'error',
      summary: 'Size Info Missing',
      detail: 'Cannot find stock info for selected size.',
      life: 3000
    });
    return;
  }

  if (item.quantity < sizeInfo.availableQuantity) {
    item.quantity++;
    this.updateCartItem(item);
  } else {
    this.messageService.add({
      key: 'global',
      severity: 'warn',
      summary: 'Stock Limit Reached',
      detail: `Only ${sizeInfo.availableQuantity} items available in stock.`,
      life: 3000
    });
  }
}

decreaseQuantity(item: any) {
  if (!this.isLoggedIn) {
    this.showSignupPanel=true;
    return;
  }

  if (item.quantity > 1) {
    item.quantity--;
    this.updateCartItem(item);
  }
}


// updateCartItem(item: any) {
//   this.cartService.updateCartItem(item.id, item.quantity, item.size)
//       .subscribe({
//         next: (res: any) => {
//           console.log('Cart updated:', res);
          
//     window.location.reload();
//         },
//         error: (err:any) => {
//           console.error('Update failed:', err);
//         }
//       });
// }

updateCartItem(item: any) {
  if (localStorage.getItem("isLoggedIn") === "true") {
    // Logged-in: call backend
    this.cartService.updateCartItem(item.id, item.quantity, item.size)
      .subscribe({
        next: (res: any) => {
          console.log('Cart updated:', res);
          // prefer to update UI without full reload - but for now refresh:
          window.location.reload();
        },
        error: (err:any) => {
          console.error('Update failed:', err);
        }
      });
  } else {
    // Guest: update localStorage
    const guestCart = this.getGuestCartRaw();
    const idx = guestCart.findIndex((ci: any) => {
      const ciVariant = ci.variantId ?? ci.id ?? ci.productId;
      const ciSizeId = ci.sizeId ?? ci.size?.sizeId ?? ci.size;
      const itemVariant = item.variantId ?? item.id ?? item.productId;
      const itemSizeId = item.sizeId ?? item.selectedSizeObj?.sizeId ?? item.size;
      return (ciVariant === itemVariant) && (ciSizeId === itemSizeId);
    });

    if (idx >= 0) {
      // update quantity & total
      guestCart[idx].quantity = item.quantity;
      // keep price/discount etc as they are
      this.saveGuestCartRaw(guestCart);
      this.buildCartFromGuest();
    } else {
      // item not found — fallback: search by variant then update that
      const byVariant = guestCart.find((ci: any) => (ci.variantId ?? ci.id ?? ci.productId) === (item.variantId ?? item.id));
      if (byVariant) {
        byVariant.quantity = item.quantity;
        this.saveGuestCartRaw(guestCart);
        this.buildCartFromGuest();
      } else {
        console.warn('Guest cart item to update not found', item);
      }
    }
  }
}

 onSizeChange(item: any) {
  if (item.selectedSizeObj) {
    item.size = item.selectedSizeObj.size; // keep string for backend
    item.quantity=1;
    this.updateCartItem(item);
  }
}



removeFromCart(item: any): void {
  if (this.isLoggedIn) {
    // Logged-in: remove from backend
    this.cartService.removeItem(item.id).subscribe({
      next: () => {
        this.cart.items = this.cart.items.filter(i => i.id !== item.id);
        this.messageService.add({
          key: 'global',
          severity: 'success',
          summary: 'Removed',
          icon: 'pi pi-trash',
          detail: `${item.variantName} removed from cart.`
        });
      },
      error: () => {
        this.messageService.add({
          key: 'global',
          severity: 'danger',
          summary: 'Failed to remove!',
          icon: 'pi pi-times'
        });
      }
    });
  } else {
  // Guest: remove from localStorage
  const guestCart = this.getGuestCartRaw();

  // Remove matching variant + sizeId (use size & sizeId both)
  const updatedCart = guestCart.filter((ci: any) => {
    const ciVariant = ci.variantId ?? ci.id ?? ci.productId;
    const ciSizeId = ci.sizeId ?? ci.size?.sizeId ?? ci.sizeId;
    const itemVariant = item.variantId ?? item.id ?? item.productId;
    const itemSizeId = item.sizeId ?? item.selectedSizeObj?.sizeId ?? item.size;

    // compare both variant and size (fallback to size string comparision)
    const variantMatch = (ciVariant === itemVariant);
    const sizeMatch = (ciSizeId != null && itemSizeId != null) ? (ciSizeId === itemSizeId) : (ci.size === item.size);
    return !(variantMatch && sizeMatch);
  });

  // Save back and rebuild UI
  this.saveGuestCartRaw(updatedCart);
  this.buildCartFromGuest();

  this.messageService.add({
    key: 'global',
    severity: 'success',
    summary: 'Removed',
    icon: 'pi pi-trash',
    detail: `${item.variantName} removed from cart.`
  });
}}
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
              sizeId: item.sizeId,
              color: item.color,
              quantity: item.quantity
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

}
