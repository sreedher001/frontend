import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminOrder,AdminOrderService } from '../adminorder/adminorder.service';
import { MessageService } from 'primeng/api';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { FluidModule } from 'primeng/fluid';
import { FormsModule, NgForm } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { ShipOrderService } from './shiporder.service';
import { AutoCompleteModule } from 'primeng/autocomplete';

export interface ShippingDto {
  orderNumber: string;
  comment: string;
  length: number;
  breadth: number;
  height: number;
  weight: number;
  giftwrapCharge: number;
  transactionCharges: number;
  pickupLocation: string;
}


@Component({
  selector: 'app-shiporder',
  standalone: true,
  imports: [FluidModule,FormsModule,
    IconFieldModule,ButtonModule,TextareaModule,AutoCompleteModule,
    InputIconModule,InputTextModule,
    FloatLabelModule],
  templateUrl: './shiporder.html',
  styleUrl: './shiporder.scss'
})
export class Shiporder implements OnInit{
  orderId!: number;
  orderDetails!: AdminOrder;
  loading = true;
  pickupLocations: string[] = [];
filteredPickupLocations: string[] = [];
  // In your component
dimensionFields: (keyof ShippingDto)[] = ['length', 'breadth', 'height', 'weight'];

chargeFields: (keyof ShippingDto)[]= [ 'giftwrapCharge', 'transactionCharges'];

  shippingDto: ShippingDto = {
  orderNumber: '',
  comment: '',
  length: 0,
  breadth: 0,
  height: 0,
  weight: 0,
  giftwrapCharge: 0,
  transactionCharges: 0,
  pickupLocation: ''
};



  ngOnInit(): void {
    this.loadPickupLocations();
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.orderId) {
      this.orderService.getOrderDetails(this.orderId).subscribe({
        next: (data:any) => {
          this.orderDetails = data;
          this.shippingDto.orderNumber=this.orderDetails.orderNumber;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          // Handle error
        }
      });
    }
  }

  constructor(private route: ActivatedRoute, private orderService: AdminOrderService,private shipOrderService:ShipOrderService,
    private messageService:MessageService) {}


  onSubmitShipping(form: NgForm) {
  if (form.valid) {
    const { length, breadth, height, weight } = this.shippingDto;

    // Validate physical dimensions
    if (length <= 0 || breadth <= 0 || height <= 0 || weight <= 0) {
      this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'Invalid Dimensions',
        detail: 'Length, breadth, height, and weight must be greater than 0.',
      });
      return;
    }

    // Proceed with API call
    console.log('Shipping DTO:', this.shippingDto);
    this.shipOrderService.createShipping(this.shippingDto).subscribe({
      next: () => {
        this.messageService.add({
          key: 'global',
          severity: 'success',
          summary: 'Shipping Initiated',
          detail: 'Order pushed to Shiprocket successfully.Check your ship rocket account and proceed',
          sticky:true
        });
      },
      error: () => {
        this.messageService.add({
          key: 'global',
          severity: 'error',
          summary: 'Shipping Error',
          detail: 'Something went wrong while pushing the order.',
          sticky:true
        });
      }
    });

  } else {
    this.messageService.add({
      key: 'global',
      severity: 'error',
      summary: 'Form Error',
      detail: 'Please fill all required shipping details.',
    });
  }
}

loadPickupLocations() {
  this.shipOrderService.loadPickupLocations().subscribe({
    next: (res) => {
      this.pickupLocations = res.pickupLocationList;
      this.filteredPickupLocations = [...this.pickupLocations];
    },
    error: () => {
      this.messageService.add({key:'global', severity: 'error', summary: 'Error', detail: 'Failed to load pickup locations' });
    
    }
  });
}

filterPickupLocations(event: any) {
  const query = event.query.toLowerCase();
  this.filteredPickupLocations = this.pickupLocations.filter(location =>
    location.toLowerCase().includes(query)
  );
}

}
