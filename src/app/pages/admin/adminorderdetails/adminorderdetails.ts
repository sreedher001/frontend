import { Component, OnInit } from '@angular/core';
import { AdminOrder, AdminOrderService } from '../adminorder/adminorder.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '@/pages/orderhistory/order.service';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { CommonModule, DatePipe } from '@angular/common';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AvatarModule } from 'primeng/avatar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-adminorderdetails',
  imports: [TagModule,CommonModule,
    FormsModule,TableModule,DatePipe,AvatarGroupModule,AvatarModule,ProgressSpinnerModule,ButtonModule,AutoCompleteModule],
  templateUrl: './adminorderdetails.html',
  styleUrl: './adminorderdetails.scss'
})
export class Adminorderdetails implements OnInit {

  orderId!: number;
  orderDetails!: AdminOrder;
  loading = true;

  constructor(private route: ActivatedRoute, private orderService: AdminOrderService,private messageService:MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.orderId) {
      this.orderService.getOrderDetails(this.orderId).subscribe({
        next: (data:any) => {
          this.orderDetails = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          // Handle error
        }
      });
    }
  }

  statusOptions = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Paid', value: 'PAID' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Shipped', value: 'SHIPPED' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Rejected', value: 'REJECTED' },
];

selectedStatus: { label: string; value: string } | any = {};
filteredStatusOptions: any[] = [];

filterStatus(event: { query: string }) {
  const query = event.query.toLowerCase();
  this.filteredStatusOptions = this.statusOptions.filter(option =>
    option.label.toLowerCase().includes(query)
  );
}


updateOrderStatus(id:any,newStatus: any): void {
  if (!newStatus || newStatus === this.orderDetails.status) return;

  this.orderService.updateOrderStatus(id, newStatus).subscribe({
    
    next: (updated:any) => {
      this.orderDetails.status = newStatus; 
      this.messageService.add({
        key:'global',
        severity: 'success',
        summary: 'Updated',
        detail: `Order marked as ${newStatus}`
      });
    },
    error: () => {
      this.messageService.add({
        key:'global',
        severity: 'error',
        summary: 'Failed',
        detail: 'Could not update order status.'
      });
    }
  });
}

shipOrder(id: any) {
  this.router.navigate(['/admin/order/ship', id]);
}

}