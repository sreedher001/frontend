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

@Component({
  selector: 'app-cart',
  imports: [ButtonModule, FormsModule, CardModule,DecimalPipe],
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
  
  relatedProducts: Product[] = [];

  constructor(private cartService: CartService,private productDetails:Productdetails,private prod : Products,
    private productService:ProductService,private messageService: MessageService
  ) { }

  ngOnInit(): void {
//    this.loadCart();

  }

  addToCart(product: Product,event: Event): void {
    event.stopPropagation();
    this.cartService.addToCart({ productId: product.id, quantity: 1 }).subscribe({
      next: () => {
        this.messageService.add({
          key: 'global',
          severity: 'info',
          summary: 'Added to cart',
          detail: `${product.name} was added successfully.`
        });
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({
          key: 'global',
          severity: 'error',
          summary: 'Add Failed',
          detail: 'Could not add to cart. Please try again.'
        });
      }
    });
    // this.loadCart();
    // window.location.reload();
  }
//   loadCart(): CartResponse {
//     this.cartService.getCart().subscribe({
//       next: (res) => {
//         this.cart = res;
// console.log("id" ,this.cart.items[0].productId )
//         // Only fetch related products if cart has items
//       if (this.cart.items && this.cart.items.length > 0) {
//         this.getRelatedProductsByCategory(this.cart.items[0].productId);
//         console.log("id" ,this.cart.items[0].productId )
//       }
//       },
//       error: (err) => {
//         console.error('Failed to load cart', err);
//       }
//     });
//     return this.cart;
//   }


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
