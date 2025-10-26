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

@Component({
  selector: 'app-cart',
  standalone:true,
  imports: [ButtonModule, NgClass, FormsModule, BadgeModule, CardModule, DecimalPipe, TagModule, AutoCompleteModule, ButtonModule, MessageModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit {



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

  getItemLength(item: CartItemDto) {
return item?.availableSizes?.length;
}

  // addToCart(product: Product,event: Event): void {
  //   event.stopPropagation();
  //   this.cartService.addToCart({ productId: product.id, quantity: 1 }).subscribe({
  //     next: () => {
  //       this.messageService.add({
  //         key: 'global',
  //         severity: 'info',
  //         summary: 'Added to cart',
  //         detail: `${product.name} was added successfully.`
  //       });
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       this.messageService.add({
  //         key: 'global',
  //         severity: 'error',
  //         summary: 'Add Failed',
  //         detail: 'Could not add to cart. Please try again.'
  //       });
  //     }
  //   });
  // }
  loadCart(): void {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (isLoggedIn) {
    // Load from backend
  this.cartService.getCart().subscribe({
    next: (res) => {
      this.cart = res;
      
      this.cart.items.forEach((item) => {
       item.sizeOptions = item.availableSizes;

        item.selectedSizeObj = item.sizeOptions.find(
    (opt: any) => opt.size === item.size
  );
      });
    },
    error: (err) => {
      console.error('Failed to load cart', err);
    }
  });
}else {
    // Load from localStorage (guest cart)
    const guestCartKey = 'guestCart';
    const guestCart = JSON.parse(localStorage.getItem(guestCartKey) || '[]');

    // Map guest cart into same format as backend `CartResponse`
    this.cart = {
      cartId: 0, // No ID for guest cart
      items: guestCart.map((item: any) => ({
        id: item.variantId, // or another identifier
        productId: item.variantId,
        variantName: item.variantName,
        quantity: item.quantity,
        size: item.size,
        sizeOptions: [ // single option or placeholder
          {
            size: item.size,
            price: item.price,
            availableQuantity: 1,
            discountPercentage: item.discountPercentage
          }
        ],
        selectedSizeObj: {
          size: item.size,
          price: item.price,
          availableQuantity: 1,
          discountPercentage: item.discountPercentage
        },
        total: this.calculateItemTotal(item),
        imageUrl: item.imageUrl
      }))
    };
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
    this.router.navigate(['/checkout']);
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
  const selectedSize = item.size;
  // Find the matching available size object
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
  if (item.quantity > 1) {
    item.quantity--;
    this.updateCartItem(item);
  }
}

updateCartItem(item: any) {
  this.cartService.updateCartItem(item.id, item.quantity, item.size)
      .subscribe({
        next: (res: any) => {
          console.log('Cart updated:', res);
          
    window.location.reload();
        },
        error: (err:any) => {
          console.error('Update failed:', err);
        }
      });
}
 onSizeChange(item: any) {
  if (item.selectedSizeObj) {
    item.size = item.selectedSizeObj.size; // keep string for backend
    item.quantity=1;
    this.updateCartItem(item);
  }
}

// removeFromCart(item: any): void {
//   this.cartService.removeItem(item.id).subscribe({
//     next: (res: any) => {
//       this.cart.items = this.cart.items.filter(i => i.id !== item.id);
//       this.messageService.add({
//       key: 'global',
//       severity: 'success',
//       summary: 'Removed',
//       icon:'pi pi-trash',
//       detail: `${item.variantName} removed from cart.`
//     });
//     },
//     error: (error) => {
//       this.messageService.add({
//       key: 'global',
//       severity: 'danger',
//       summary: 'Failed to remove!',
//       icon:'pi pi-times'
//     });
//     }
//   });
// }

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
   const guestCartKey = 'guestCart';
  const guestCart = JSON.parse(localStorage.getItem(guestCartKey) || '[]');

  // Remove matching variant + size
  const updatedCart = guestCart.filter(
    (ci: any) => !(ci.variantId === item.variantId && ci.sizeId === item.sizeId)
  );

  // Rebuild selectedSizeObj
  const rebuiltCart = updatedCart.map((ci:any) => ({
    ...ci,
    selectedSizeObj: {
      size: ci.size,
      sizeId: ci.sizeId,
      availableQuantity: ci.availableQuantity ?? 1 // default to 1 if undefined
    }
  }));

  // Update localStorage
  localStorage.setItem(guestCartKey, JSON.stringify(updatedCart));

  // THIS is the key step you're missing:
  this.cart.items = this.rebuildGuestCartItems(guestCart);

  // Optional toast
  this.messageService.add({
    key: 'global',
    severity: 'success',
    summary: 'Removed',
    icon: 'pi pi-trash',
    detail: `${item.variantName} removed from cart.`
  });

  console.log('updatedCart:', updatedCart);
  console.log('this.cart.items (after rebuild):', this.cart.items);
}
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

}
