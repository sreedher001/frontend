import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router ,ActivatedRoute} from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputOtpModule } from 'primeng/inputotp';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { OrderService } from '../orderhistory/order.service';
import { OrderDetailResponse } from '../orderstatus/orderstatus';
import { MessageService } from 'primeng/api';
import { ProfileService } from '../profile/profile.service';
import { ResolveImagePipe } from '@/shared/resolve-image.pipe';

@Component({
  selector: 'app-order-success-component',
  imports: [InputOtpModule, ButtonModule, CommonModule,TooltipModule,InputTextModule,TagModule, FormsModule,CardModule,ResolveImagePipe],
  templateUrl: './order-success-component.html',
  styleUrl: './order-success-component.scss',
})
export class OrderSuccessComponent implements OnInit {
constructor(private profileService:ProfileService,private router:Router,private messageService: MessageService, private route: ActivatedRoute,private orderService:OrderService){}

ngOnInit() {
  this.route.queryParams.subscribe(params => {
    this.orderNumber = params['orderNumber'];
    if (this.orderNumber) {
      this.fetchOrderDetails();
    }
  });
}

fetchOrderDetails() {
  this.orderService.getOrderStatus(this.orderNumber).subscribe({
    next: (order) => {
      this.order = order;
    },
    error: (err) => {
     this.messageService.add({key: 'global', severity: 'error', summary: 'Error', detail: 'Failed to fetch order details.' });
    }
  });
}
gotoOrderHistory(){
  this.router.navigate(['/order/order-history'])
}
goHome(){
  this.router.navigate(['/']);
}

order?: OrderDetailResponse;
orderNumber!: string;
  email = "";
otp = "";
loading = false;


otpSent = false;
emailVerified = false;

sendOtp() {

  if (!this.email) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Enter Email',
      detail: 'Please enter your email address'
    });
    return;
  }

  this.loading = true;

  this.profileService.sendOtp('email', this.email).subscribe({
    next: () => {

      this.loading = false;
      this.otpSent = true;

      this.messageService.add({
        severity: 'success',
        summary: 'OTP Sent',
        detail: 'Verification code sent to your email'
      });

    },
    error: () => {

      this.loading = false;

      this.messageService.add({
        severity: 'error',
        summary: 'Failed',
        detail: 'Unable to send OTP'
      });

    }
  });

}

verifyOtp() {

  if (!this.otp) {
    return;
  }

  this.loading = true;

  this.profileService.verifyOtp('email', this.email, this.otp).subscribe({
    next: () => {

      this.loading = false;
      this.emailVerified = true;

      this.messageService.add({
        severity: 'success',
        summary: 'Verified',
        detail: 'Email verified successfully'
      });

    },
    error: () => {

      this.loading = false;

      this.messageService.add({
        severity: 'error',
        summary: 'Invalid OTP',
        detail: 'Please try again'
      });

    }
  });

}
}
