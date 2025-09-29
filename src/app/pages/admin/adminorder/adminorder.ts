import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { AdminOrder, AdminOrderService } from './adminorder.service';
import { MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-adminorder',
  imports: [TableModule, DatePipe, DatePickerModule, FormsModule, TableModule, ButtonModule, FloatLabelModule,RouterModule,TagModule],
  templateUrl: './adminorder.html',
  styleUrl: './adminorder.scss'
})
export class Adminorder implements OnInit{

  orders: AdminOrder[] = [];
  loading = false;
maxDate: Date = new Date();
  startDate: Date = new Date(); // default to today
  endDate: Date = new Date();   // default to today
  pageSize: number = 10;
  currentPage: number = 0;
  totalOrders: number = 0;
  constructor(
    private orderService: AdminOrderService,
    private messageService: MessageService,private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.loadOrdersByDateRange(this.startDate, this.endDate);
  }

  loadOrdersByDateRange(startDate: Date, endDate: Date, page: number = 0, size: number = 10): void {
  this.loading = true;
  const formatLocalDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-CA').format(date); // 'YYYY-MM-DD' in local timezone
  };

  const formattedStart = formatLocalDate(startDate);
  const formattedEnd = formatLocalDate(endDate);

  this.orderService.getOrdersByDateRange(formattedStart, formattedEnd, page, size).subscribe({
    next: (response) => {
      this.orders = response.content; // if using Spring Page object
      this.totalOrders = response.totalElements;
      this.currentPage = response.number;
      this.pageSize = response.size;
      this.loading = false;
    },
    error: () => {
      this.loading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load orders for selected date range'
      });
    }
  });
}

onPageChange(event: any): void {
    this.loadOrdersByDateRange(this.startDate, this.endDate, event.page, event.rows);
  }


  updateStatus(id: number, status: string) {
    this.orderService.updateOrderStatus(id, status).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Order status updated' });
      
    });
  }

  rejectOrder(orderNumber: string) {
    this.orderService.rejectOrder(orderNumber).subscribe(() => {
      this.messageService.add({ severity: 'warn', summary: 'Rejected', detail: 'Order rejected' });
      
    });
  }

  shipOrder(order: AdminOrder) {
    const dto = {
      orderId: order.orderNumber,
      address: 'Test Address',
      city: 'Test City',
      pincode: '123456',
    };
    this.orderService.shipOrder(dto).subscribe(() => {
      this.messageService.add({ severity: 'info', summary: 'Shipped', detail: 'Order sent to Shiprocket' });
    });
  }

  viewOrderDetails(orderId: number): void {
  this.orderService.getOrderDetails(orderId).subscribe({
    next: (orderDetails) => {
      console.log('Order Details:', orderDetails);
      // You can open a dialog or navigate to details page here
    },
    error: () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load order details' });
    }
  });
}
}
