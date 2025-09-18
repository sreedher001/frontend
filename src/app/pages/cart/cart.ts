import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CartService } from './cart.service';
import { CardModule } from 'primeng/card';
import { BehaviorSubject } from 'rxjs';
import { CartItemDto, CartResponse } from './cart.model';
import { DecimalPipe } from '@angular/common';
import { Product } from '@/models/product.model';
import { Products } from '../products/products';
import { Productdetails } from '../productdetails/productdetails';
import { ProductService } from '../products/product.service';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone:true,
  imports: [ButtonModule, FormsModule, CardModule,DecimalPipe,TagModule,AutoCompleteModule,ButtonModule],
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
  sizeOptions:any[]=[];

autoFilteredSizeValue: any[] = [];
  
  relatedProducts: Product[] = [];

  constructor(private cartService: CartService,private productDetails:Productdetails,private prod : Products,
    private productService:ProductService,private messageService: MessageService,private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCart();

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
  this.cartService.getCart().subscribe({
    next: (res) => {
      this.cart = res;
      this.cart.items.forEach((item) => {
       item.sizeOptions = item.availableSizes;
      });
    },
    error: (err) => {
      console.error('Failed to load cart', err);
    }
  });
}

 filterSize(event: AutoCompleteCompleteEvent,item:any) {
    const query = event.query;
    const filtered: any[] = [];

    for (let i = 0; i < (item.sizeOptions as any[]).length; i++) {
      const sizeItem = (item.sizeOptions as any[])[i];
      if (sizeItem.size.toLowerCase().indexOf(query.toLowerCase()) == 0) {
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


  getCartTotal(): number {
    return this.cart.items.reduce((total: number, item: any) => total + item.total, 0);
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
increaseQuantity(item: CartItemDto) {
  if (item.quantity < 10) {
    item.quantity++;
    this.updateCartItem(item);
  }
}

decreaseQuantity(item: CartItemDto) {
  if (item.quantity > 1) {
    item.quantity--;
    this.updateCartItem(item);
  }
}

updateCartItem(item: CartItemDto) {
  // Call backend to update quantity, or re-calculate total if local
  item.total = item.quantity * item.price;
  // Optionally: call cartService.updateItem(item) if using API
}

}
