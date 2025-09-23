import { Component, OnInit } from '@angular/core';
import { OrderService } from './order.service';
import { DatePipe } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AvatarModule } from 'primeng/avatar';
import { BrowserModule } from '@angular/platform-browser';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { TagModule } from 'primeng/tag';
import { Router } from '@angular/router';

export interface OrderSummaryDto {
  orderNumber: string;
  orderDate: string; // ISO string
  totalAmount: number;
  paymentMode: string;
  status: string;
  items:any[];
}
@Component({
  selector: 'app-orderhistory',
  imports: [DatePipe,ImageModule,CardModule,TableModule,ProgressSpinnerModule,AvatarGroupModule,AvatarModule,OverlayBadgeModule,TagModule],
  templateUrl: './orderhistory.html',
  styleUrl: './orderhistory.scss'
})
export class Orderhistory implements OnInit{
 orders: OrderSummaryDto[] = [];
loading = false;
  error = false;
  constructor(private orderService: OrderService,private router: Router) {}
   ngOnInit(): void {
    this.loadOrderHistory();
  }
 

  loadOrderHistory(): void {
    this.loading = true;
    this.error = false;

    this.orderService.getOrderHistory().subscribe({
      next: (data:any) => {
        this.orders = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  
goToProductDetails(variantId: number) {
  this.router.navigate(['/product-details', variantId]);
}
}
