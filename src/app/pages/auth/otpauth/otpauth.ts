import { Component, EventEmitter, Output } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputOtpModule } from 'primeng/inputotp';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { CartService } from '@/pages/cart/cart.service';
import { JwtHelper } from '@/jwt/jwt-helper';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-otpauth',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    InputOtpModule,FloatLabelModule
  ],
  templateUrl: './otpauth.html',
  styleUrl: './otpauth.scss',
})
export class Otpauth {
   @Output() loginSuccess = new EventEmitter<any>();

  phoneNumber: string = '';
  otp: string = '';

  otpSent: boolean = false;
  loading: boolean = false;

  countdown: number = 0;
  timer: any;

  constructor(private loginService: LoginService, private cartService: CartService,
    private jwtHelper: JwtHelper, private router: Router, private messageService: MessageService) {}

  sendOtp() {
    if (!this.phoneNumber) return;

    this.loading = true;

    this.loginService.sendPhoneOtp(this.phoneNumber).subscribe({
      next: () => {
        this.loading = false;
        this.otpSent = true;
        this.startTimer();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  verifyOtp() {
    this.loading = true;

    this.loginService.verifyPhoneOtp(this.phoneNumber, this.otp).subscribe({
      next: (res: any) => {
        this.loading = false;

         const token = res?.token;

      if (token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('isLoggedIn', "true");

        const userInfo = this.jwtHelper.getUserInfo();
        localStorage.setItem('userName', userInfo?.name);
      }

        this.cartService.mergeCart().subscribe({
          next: () => this.cartService.getCart().subscribe(),
          error: () => {}
        });

        const roles: string[] = res?.roles || this.jwtHelper.getUserRoles();
        if (roles.includes('ROLE_ADMIN')) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/']);
        }

        this.loginSuccess.emit(res);
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  resendOtp() {
    this.sendOtp();
  }

  startTimer() {
    this.countdown = 30;

    this.timer = setInterval(() => {
      this.countdown--;

      if (this.countdown <= 0) {
        clearInterval(this.timer);
      }
    }, 1000);
  }
}
