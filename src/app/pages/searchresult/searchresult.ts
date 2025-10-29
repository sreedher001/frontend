import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { ChipModule } from 'primeng/chip';
import { FluidModule } from 'primeng/fluid';
import { TagModule } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { Product } from '@/models/product.model';

import { ProductResponse } from '@/models/product-response.model';
import { ProductVariantResponseDto } from '@/models/productVariantResponseDto';
import { ProductService } from '../products/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelper } from '@/jwt/jwt-helper';
import { MessageService } from 'primeng/api';
import { Signup } from "../auth/signup/signup";
import { LoginComponent } from "../auth/login";

@Component({
  selector: 'app-searchresult',
  imports: [CardModule, CommonModule, ButtonModule, FluidModule, TagModule, FormsModule, BadgeModule, Tooltip, CarouselModule,
    ChipModule, Signup, LoginComponent],
  templateUrl: './searchresult.html',
  styleUrl: './searchresult.scss'
})
export class Searchresult implements OnInit{

  products: Product[] = [];
    productResponseDto!:ProductResponse;
    loading: boolean = false;
    page: number = 0;
size: number = 10;
lastPage: boolean = false;
showSignupPanel = false;
isLoggedIn:boolean =false;
showLogin = false;
wishlistVariantIds: Set<number> = new Set(); // Store variant IDs in wishlist
wishlistItems: any[] = [];
isAdmin: boolean = false;

    constructor(private productService: ProductService,private router: Router,private jwtHelper: JwtHelper,

    private messageService: MessageService,public route: ActivatedRoute
  ) { }
    ngOnInit(): void {
      const roles = this.jwtHelper.getUserRoles();
  if (roles.includes('ROLE_ADMIN')) {
    this.isAdmin=true;
  }

      if(localStorage.getItem("isLoggedIn")==="true"){
      this.isLoggedIn=true;}
    
    if(localStorage.getItem("isLoggedIn")==="true"){
      this.isLoggedIn=true;
    this.productService.getWishlist().subscribe({
    next: (items: any[]) => {
      this.wishlistItems = items;
      this.wishlistVariantIds = new Set(items.map(i => i.variantId));
    },
    error: (err) => {
      console.error('Failed to load wishlist', err);
    }
  });
}

      
      this.route.paramMap.subscribe(params => {
    const style = params.get('style');
    this.getWearType(style);
  });
    }

  //  getWearType(style: string | null) {
  //   this.products=[];
  //   this.loading = true;
  //   this.productService.getWearType(style, 0, 20).subscribe(res => {
  //     this.productResponseDto = res;
  //     this.products.push(...res.content);
  //    console.log("products===",this.products);
      
  //     this.lastPage = res.last; // comes from Spring Data Page
  //     this.page++; // increment for next call
  //     this.loading = false;
  //   });
  // }

  getWearType(style: string | null, append: boolean = false) {
  if (this.loading || this.lastPage) return;
  this.loading = true;

  this.productService.getWearType(style, this.page, this.size).subscribe({
    next: (res) => {
      this.productResponseDto = res;

      // only reset when it's the first page (fresh load)
      if (!append) {
        this.products = [];
      }

      this.products.push(...res.content);
      console.log('products===', this.products);

      this.lastPage = res.last;
      this.page++; // prepare for next page
      this.loading = false;
    },
    error: (err) => {
      console.error('Failed to fetch products', err);
      this.loading = false;
    }
  });
}

  onCardClick(product:Product,variant:ProductVariantResponseDto) {
  this.router.navigate(['/product-details',variant.id]);
}
isInWishlist(variant: any): boolean {
  return this.wishlistVariantIds.has(variant.id);
}


  toggleWishlist(variant: any, event: MouseEvent): void {
  event.stopPropagation(); // prevent card click

  if(this.isLoggedIn){
  const variantId = variant.id;

  if (this.isInWishlist(variant)) {
    // If already in wishlist → remove
    this.productService.removeFromWishlist(variantId).subscribe({
      next: () => {
        this.wishlistVariantIds.delete(variantId);
      },
      error: () => {
        // Optionally show error toast
      }
    });
  } else {
    // If not in wishlist → add
    this.productService.addToWishlist(variantId).subscribe({
      next: () => {
        this.wishlistVariantIds.add(variantId);
      },
      error: () => {
        // Optionally show error toast
      }
    });
  }
}else{
  this.showSignupPanel=true;
}
}
toggleSignupPanel() {
  this.showSignupPanel = !this.showSignupPanel;

  // Optional: reset to signup when panel opens
  if (this.showSignupPanel) {
    this.showLogin = false;
  }
}
toggleLogin() {
  this.showLogin = !this.showLogin;
}
handleLoginSuccess($event:any) {
  this.isLoggedIn = true;
  this.showSignupPanel = false;

  // Refresh the current page
  window.location.reload();
}
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

  
getVariantFrontImage(variant: any): string {
  const frontImage = variant.productImage?.find((img: any) => img.viewType === 'front');
  return frontImage?.imageUrl || 'assets/placeholder.jpg';
}

getVariantFinalPrice(variant: any): number {
  const size = variant?.sizes?.[0];
  if (!size) return 0;
  return size.price - (size.price * (size.discountPercentage ?? 0)) / 100;
}

getVariantSavings(variant: any): string {
  const size = variant?.sizes?.[0];
  if (!size || !size.discountPercentage) return '';
  const discountAmount = (size.price * size.discountPercentage) / 100;
  return `Save ₹${discountAmount.toFixed(0)}`;
}

getBestSize(variant: any) {
  if (!variant?.sizes?.length) return null;
  return variant.sizes.reduce((prev:any, curr:any) =>
    curr.price < prev.price ? curr : prev
  );
}
hasDiscount(product: any): boolean {
  return !!product.variants?.[0]?.sizes?.[0]?.discountPercentage;
}

editProduct(variant: any,event: MouseEvent) {
  event.stopPropagation();
  this.router.navigate(
    ['/admin/products/edit'],
    { queryParams: { variantId: variant.id, mode: 'edit' } }
  );
}

deleteProduct(variant: any,event: MouseEvent) {
  event.stopPropagation();
 this.router.navigate(
    ['/admin/products/edit'],
    { queryParams: { variantId: variant.id, mode: 'edit' } }
  );
}
getDeliveryDate(): string {
  const today = new Date();
  today.setDate(today.getDate() + 5); // e.g., 5 days from now
  return today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
}
