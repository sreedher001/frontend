import { Component, OnInit } from '@angular/core';
import { OrderService } from './order.service';
import { CommonModule, DatePipe } from '@angular/common';
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
import { MenuItem } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { Step, StepperModule } from 'primeng/stepper';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

export interface OrderSummaryDto {
  orderNumber: string;
  orderDate: string; // ISO string
  totalAmount: number;
  paymentMode: string;
  status: string;
  items:any[];
}

interface StepData {
  stepId: number;
  label: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
  details?: any;
}
@Component({
  selector: 'app-orderhistory',
  imports: [DatePipe,DialogModule,StepperModule,ButtonModule,CommonModule,ImageModule,CardModule,TableModule,ProgressSpinnerModule,AvatarGroupModule,AvatarModule,OverlayBadgeModule,TagModule],
  templateUrl: './orderhistory.html',
  styleUrl: './orderhistory.scss'
})
export class Orderhistory implements OnInit{

 orders: OrderSummaryDto[] = [];
loading = false;
  error = false;
  
  
  displayTrackingModal = false;
selectedOrder: any = null;
steps: StepData[] = [];
activeStep = 1; // e.g., set dynamically based on order.status
// steps: MenuItem[] = [
//   { label: 'Placed' },
//   { label: 'Paid' },
//   { label: 'Processing' },
//   { label: 'Shipped' },
//   { label: 'Delivered' }
// ];
activeStepIndex = 0;

orderStatusToStepMap:Record<string, number> = {
  'PLACED': 1,
  'PAID': 2,
  'PROCESSING': 3,
  'SHIPPED': 4,
  'DELIVERED': 5,
};

stepLabels:{ [key: number]: string } = {
  1: 'Placed',
  2: 'Paid',
  3: 'Processing',
  4: 'Shipped',
  5: 'Delivered',
};


maxAllowedStep: number = 1;
  constructor(private orderService: OrderService,private router: Router) {}
   ngOnInit(): void {
    this.loadOrderHistory();
  }
 
// openTrackingModal(order: any) {
//   this.selectedOrder = order;
//   this.activeStepIndex = this.getStepIndex(order.status);
//   this.displayTrackingModal = true;
// }

getStepIndex(status: string): number {
  switch (status.toUpperCase()) {
    case 'PLACED': return 0;
    case 'PAID': return 1;
    case 'PROCESSING': return 2;
    case 'SHIPPED': return 3;
    case 'DELIVERED': return 4;
    default: return 0;
  }
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





// Call this when user wants to track an order (pass order object or number)
openTrackingModal(order: any) {
  this.selectedOrder = order;
  this.activeStep = this.orderStatusToStepMap[order.status];
  this.maxAllowedStep=this.activeStep;
  const currentStepId = this.orderStatusToStepMap[order.status] || 1;
  this.activeStep = currentStepId;

  // Build stepper data with statuses
  this.steps = [1, 2, 3, 4, 5].map(stepId => {
    let stepStatus: 'completed' | 'current' | 'pending';
    if (stepId < currentStepId) stepStatus = 'completed';
    else if (stepId === currentStepId) stepStatus = 'current';
    else stepStatus = 'pending';

    // Optional: Add details for specific steps
    let details: any = null;
    if (stepId === 2 && stepStatus !== 'pending') {
      details = {
        paymentMode: order.paymentMode,
        totalAmount: order.totalAmount,
        orderNumber: order.orderNumber,
      };
    }
    if (stepId === 1) {
      details = {
        orderNumber:order.orderNumber,
        orderDate: order.orderDate,
        items: order.items,
      };
    }
    // Add more details for other steps as you want

    return {
      stepId,
      label: this.stepLabels[stepId],
      status: stepStatus,
      details,
    };
  });

  this.displayTrackingModal = true;
}

isStepClickable(stepId: number) {
  const step = this.steps.find(s => s.stepId === stepId);
  return step ? (step.status === 'completed' || step.status === 'current') : false;
}

onStepSelect(event: any) {
    const selectedStep = event.value;
    if (selectedStep <= this.maxAllowedStep) {
      this.activeStep = selectedStep;
    } else {
      // Reset to activeStep to prevent navigation
      this.activeStep = this.activeStep;
    }
  }
}
