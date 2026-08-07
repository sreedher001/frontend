import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { Button, ButtonModule } from "primeng/button";
import { WishlistService } from './wishlist.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductService } from '../products/product.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ResolveImagePipe } from '@/shared/resolve-image.pipe';


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
  imports: [AvatarModule, CardModule, CommonModule,ButtonModule,ConfirmDialogModule,ResolveImagePipe],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss'
})
export class Wishlist implements OnInit {
  loading = true;
  wishlist: WishlistItem[] = [];

  constructor(private router: Router,private wishlistService: WishlistService,private messageService:MessageService,
    private productService:ProductService,
    private confirmationService: ConfirmationService) {}

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
          severity:'secondary',
          summary: 'Consider adding what you love',
          icon:'pi pi-heart-fill text-red-500'
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
// removeItemFromWishlist(variantId: number, event: MouseEvent): void {
//   event.stopPropagation();

//   this.productService.removeFromWishlist(variantId).subscribe({
//     next: () => {
//       this.wishlist = this.wishlist.filter(item => item.variantId !== variantId);
//       this.messageService.add({
//         key:'global',
//         severity:'success',
//         summary:'Item removed',
//         icon:'pi pi-check'
//       });
//     },
//     error: (err) => {
//       console.error('Remove failed', err);
//     }
//   });
// }


removeItemFromWishlist(variantId: number, event: MouseEvent): void {
    event.stopPropagation();

    // 🔒 Confirmation before delete
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this item from your wishlist?',
      header: 'Confirm Removal',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes, Remove',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-contrast p-button-sm',
      rejectButtonStyleClass: 'p-button-contrast p-button-outlined p-button-sm',
      accept: () => {
        this.productService.removeFromWishlist(variantId).subscribe({
          next: () => {
            this.wishlist = this.wishlist.filter(item => item.variantId !== variantId);
            this.messageService.add({
              key: 'global',
              severity: 'success',
              summary: 'Removed',
              detail: 'Item removed from wishlist',
              icon: 'pi pi-check'
            });
          },
          error: (err) => {
            console.error('Remove failed', err);
            this.messageService.add({
              key: 'global',
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to remove item.'
            });
          }
        });
      }
    });
  }
}
