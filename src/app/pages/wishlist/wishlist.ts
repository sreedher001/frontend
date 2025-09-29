import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { Button, ButtonModule } from "primeng/button";
import { WishlistService } from './wishlist.service';
import { MessageService } from 'primeng/api';
import { ProductService } from '../products/product.service';


interface WishlistItem {
  variantId: number;
  productName: string;
  imageUrl: string;
  price: number;
  color: string;
  inStock: boolean;
}
@Component({
  selector: 'app-wishlist',
  imports: [AvatarModule, CardModule, CommonModule,ButtonModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss'
})
export class Wishlist implements OnInit {
  loading = true;
  wishlist: WishlistItem[] = [];

  constructor(private router: Router,private wishlistService: WishlistService,private messageService:MessageService,
    private productService:ProductService) {}

  ngOnInit() {
    this.loading = true;
    this.wishlistService.getWishlist().subscribe({
      next: (res) => {
        this.wishlist = res;
        this.loading = false;
        if(this.wishlist.length>0){
        this.messageService.add({
          key:'global',
          severity:'success',
          summary: 'Success',
        detail: 'Wishlist fetched!',
        });
      }else{
        this.messageService.add({
          key:'global',
          severity:'info',
          summary: 'Consider adding what you love',
          icon:'pi pi-heart-fill'
        })
      }},
      error: (err) => {
        console.error('Failed to load wishlist', err);
        this.loading = false;
      }
    });
  
  }

  goToProductDetails(variantId: number) {
    this.router.navigate(['/product-details', variantId]);
  }
goToProducts(): void {
  this.router.navigate(['/']); // Adjust route if needed
}
removeItemFromWishlist(variantId: number, event: MouseEvent): void {
  event.stopPropagation();

  this.productService.removeFromWishlist(variantId).subscribe({
    next: () => {
      this.wishlist = this.wishlist.filter(item => item.variantId !== variantId);
      this.messageService.add({
        key:'global',
        severity:'success',
        summary:'Item removed',
        icon:'pi pi-check'
      });
    },
    error: (err) => {
      console.error('Remove failed', err);
    }
  });
}

}
