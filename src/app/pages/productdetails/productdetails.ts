import { Component, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { GalleriaModule } from 'primeng/galleria';
import { Products } from "../products/products";
import { Rating } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { ProductResponse } from '@/models/product-response.model';
import { ProductService } from '../products/product.service';
import { Product } from '@/models/product.model';
import { MessageService } from 'primeng/api';
import { CartService } from '../cart/cart.service';
@Component({
  selector: 'app-productdetails',
  imports: [GalleriaModule, ButtonModule, Rating, FormsModule],
  templateUrl: './productdetails.html',
  styleUrl: './productdetails.scss'
})
@Injectable({
  providedIn: 'root' 
})
export class Productdetails implements OnInit {
productId!: number;
product!: Product;
  images: any[] = [];
 
  constructor(private route: ActivatedRoute,private productService: ProductService, private cartService: CartService,
    private messageService: MessageService) {}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
    this.productId = Number(params.get('id'));
    this.getProductByVariantId(this.productId);
   // this.fetchProduct();
  });
  }
  // fetchProduct(): Product {
  //   this.productService.getProductById(this.productId).subscribe({
  //     next: (data) => {
  //       this.product = data;
  //       this.images = data.imageUrls.map((img: string) => ({
  //         itemImageSrc: img,
  //         thumbnailImageSrc: img,
  //         alt: this.product.name,
  //       }));
  //     },
  //     error: (err) => {
  //       console.error('Error fetching product:', err);
  //     }
  //   });
  //   return this.product;
  // }
  getProductByVariantId(productId:number): Product {
    this.productService.getProductByVariantId(productId).subscribe({
      next: (data) => {
        this.product = data;
        this.images = data.variant.productImage.map((img: any) => ({
          itemImageSrc: img.imageUrl,
          thumbnailImageSrc: img.imageUrl,
          alt: this.product.name,
        }));
      },
      error: (err) => {
        console.error('Error fetching product:', err);
      }
    });
    return this.product;
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
  }

  buyNow(product: Product): void {
    // implement later
  }

  responsiveOptions = [
    { breakpoint: '1024px', numVisible: 3 },
    { breakpoint: '768px', numVisible: 2 },
    { breakpoint: '560px', numVisible: 1 }
  ];

}
