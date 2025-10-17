import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Step, StepperModule } from 'primeng/stepper';
import { Card, CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../orderhistory/order.service';
import { ImageModule } from 'primeng/image';

interface OrderItemDto {
  productId: number;
  variantId: number;
  productName: string;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
  total: number;
  imageUrl?: string;
}

interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  phoneNumber: string;
}

export interface OrderDetailResponse {
  orderNumber: string;
  orderDate: Date;
  paymentMode: string;
  shippingAddress: ShippingAddress;
  totalAmount: number;
  shippingFee:number;
  subtotal:number;
  status: 'placed' | 'paid' | 'processing' | 'shipped' | 'delivered';
  items: OrderItemDto[];
}
interface StepData {
  stepId: number;
  label: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
  details?: any;
}

@Component({
  selector: 'app-orderstatus',
  imports: [StepperModule, CardModule,StepperModule,CommonModule, TableModule,ButtonModule,TagModule,ImageModule],
  templateUrl: './orderstatus.html',
  styleUrl: './orderstatus.scss'
})
export class Orderstatus {

   @Input() order!: OrderDetailResponse;

  activeStep = 0;
loading:boolean=true;
steps: StepData[] = [];
maxAllowedStep: number = 1;
constructor(
  private route: ActivatedRoute,
  private orderService: OrderService
) {}
  ngOnInit(): void {
  const orderNumber = this.route.snapshot.paramMap.get('orderNumber');
  this.loading=true;
  if (orderNumber) {
    this.orderService.getOrderStatus(orderNumber).subscribe({
      next: (response) => {
        this.order = response;
        this.activeStep = this.getStepIndex(this.order.status);

        // Build stepper data with statuses
  this.steps = [1, 2, 3, 4, 5].map(stepId => {
    let stepStatus: 'completed' | 'current' | 'pending';
    if (stepId < this.activeStep) stepStatus = 'completed';
    else if (stepId === this.activeStep) stepStatus = 'current';
    else stepStatus = 'pending';

    // Optional: Add details for specific steps
    let details: any = null;
    if (stepId === 2 && stepStatus !== 'pending') {
      details = {
        paymentMode: this.order.paymentMode,
        totalAmount: this.order.totalAmount,
        orderNumber: this.order.orderNumber,
      };
    }
    if (stepId === 1) {
      details = {
        orderNumber:this.order.orderNumber,
        orderDate: this.order.orderDate,
        items: this.order.items,
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


        this.loading=false;
      },
      
      error: (err) => {
        console.error('Error fetching order status:', err);
      }
    });
  } else {
    console.warn('No order number found in route.');
  }
}

goToStep(step: number) {
  if (step >= 0 && step <= 3) {
    this.activeStep = step;
  }
}
getStepIndex(status: string): number {
  switch (status.toUpperCase()) {
    case 'PLACED': return 1;
    case 'PAID': return 2;
    case 'PROCESSING': return 3;
    case 'SHIPPED': return 4;
    case 'DELIVERED': return 5;
    default: return 1;
}
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


  getStepStatus(stepIndex: number): 'completed' | 'current' | 'pending' {
  if (stepIndex < this.activeStep) return 'completed';
  if (stepIndex === this.activeStep) return 'current';
  return 'pending';
}
}
