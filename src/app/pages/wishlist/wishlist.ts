import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { Button } from "primeng/button";
import { WishlistService } from './wishlist.service';
import { MessageService } from 'primeng/api';


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
  imports: [AvatarModule, CardModule, CommonModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss'
})
export class Wishlist implements OnInit {
  loading = true;
  wishlist: WishlistItem[] = [];

  constructor(private router: Router,private wishlistService: WishlistService,private messageService:MessageService) {}

  ngOnInit() {
    this.loading = true;
    this.wishlistService.getWishlist().subscribe({
      next: (res) => {
        this.wishlist = res;
        this.loading = false;
        this.messageService.add({
          key:'global',
          severity:'success',
          summary: 'Success',
        detail: 'Wishlist fetched!',
        })
      },
      error: (err) => {
        console.error('Failed to load wishlist', err);
        this.loading = false;
      }
    });
  
  }

  goToProductDetails(variantId: number) {
    this.router.navigate(['/product-details', variantId]);
  }
}
