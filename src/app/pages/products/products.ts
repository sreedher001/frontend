import { Product } from '@/models/product.model';
import { CommonModule } from '@angular/common';
import { Component, Injectable, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Carousel } from 'primeng/carousel';
import { FluidModule } from 'primeng/fluid';
import { TagModule } from 'primeng/tag';
import { ProductService } from './product.service';
import { Router } from '@angular/router';
import { JwtHelper } from '@/jwt/jwt-helper';
import { CartService } from '../cart/cart.service';
import { MessageService } from 'primeng/api';
import { Rating } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-products',
  imports: [CardModule, CommonModule, ButtonModule, FluidModule, TagModule,FormsModule,BadgeModule,Tooltip],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
@Injectable({
  providedIn: 'root' 
})
export class Products implements OnInit {



  products: Product[] = [];
  loading: boolean = false;
  isAdmin: boolean = false;

  constructor(private productService: ProductService,private router: Router,private jwtHelper: JwtHelper,
     private cartService: CartService,
    private messageService: MessageService
  ) { }
  ngOnInit(): void {
    this.fetchProducts();

 const user = this.jwtHelper.getUserDetails();
  console.log('User info:', user);

  const isExpired = this.jwtHelper.isTokenExpired();
  console.log('Token expired:', isExpired);

  const roles = this.jwtHelper.getUserRoles();
  if (roles.includes('ROLE_ADMIN')) {
    console.log('Admin access granted.');
    this.isAdmin=true;
  }

  }

  fetchProducts(): void {
    this.loading = true;
    this.productService.getAllProducts(0, 10).subscribe({
      next: (res) => {
        this.products = res.content;
        this.loading = false;
        this.messageService.add({
          key: 'global',
          severity: 'success',
          summary: 'TADA!',
          detail: 'Enjoy shopping with ZFC!'
        });
      },
      error: (err) => {
        console.error('Failed to fetch products:', err);
        this.loading = false;
         this.messageService.add({
          key: 'global',
          severity: 'error',
          summary: 'Oops!',
          detail: 'Failed to fetch the products'
        });
      }
    });

  }

  /**
   * Get the first "front" image of the first available variant.
   */
  getFrontImage(product: Product): string {
    if (!product.variants || product.variants.length === 0) {
      return 'assets/no-image.png'; // fallback image
    }

    // Loop through variants → find first front image
    for (let variant of product.variants) {
      if (variant.productImage && variant.productImage.length > 0) {
        const frontImg = variant.productImage.find(img => img.viewType === 'front');
        if (frontImg) {
          return frontImg.imageUrl; // return the front image URL
        }
      }
    }

    return 'assets/no-image.png'; // fallback if no front image found
  }
  onCardClick(product:Product) {
  this.router.navigate(['/product-details',product.id]);
  this.fetchProducts();
}
  buyNow(product: Product): void {
    console.log('Buying:', product.name);
    // implement navigation to checkout or detail page
  }

  addToCart(product: Product): void {
    //event.stopPropagation();
    this.cartService.addToCart({ productId: product.id, quantity: 1 }).subscribe({
      next: () => {
        this.messageService.add({
          key: 'global',
          severity: 'success',
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


editProduct(product: any) {
  console.log("Editing product:", product);
  // open edit dialog / navigate
  alert("Editing product");
}

deleteProduct(product: any) {
  console.log("Deleting product:", product);
   alert("Deleting product");
  // show confirm + delete API call
}


  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'success';
    }
  }

  getFinalPrice(product: any): number {
  if (
    product.variants &&
    product.variants.length > 0 &&
    product.variants[0].sizes &&
    product.variants[0].sizes.length > 0
  ) {
    const size = product.variants[0].sizes[0];
    if (size.discountPercentage > 0) {
      return size.price - (size.price * size.discountPercentage) / 100;
    }
    return size.price;
  }
  return 0;
}
getDeliveryDate(): string {
  const today = new Date();
  today.setDate(today.getDate() + 5); // e.g., 5 days from now
  return today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

getSavings(product: any): string {
  const size = product.variants[0].sizes[0];
  if (size.discountPercentage > 0) {
    const savings = Math.round(size.price * size.discountPercentage / 100);
    return `Save ₹${savings} (${size.discountPercentage}% OFF)`;
  }
  return '';
}


  carouselResponsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];
}
