import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { LoginRequest, LoginService } from './login.service';
import { JwtHelper } from '@/jwt/jwt-helper';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputOtpModule } from 'primeng/inputotp';
import { CartService } from '../cart/cart.service';
import { DividerModule } from 'primeng/divider';
import { StoreSettingsService } from '@/store-settings/store-settings.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, FloatLabelModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, CommonModule, InputOtpModule, DividerModule],
    template: `
    @if(!isForgotPasswordFlow) {
    <div class="w-full max-w-md mx-auto bg-white dark:bg-surface-900 p-6 sm:p-8 rounded-2xl shadow-lg">
      <div class="text-center mb-6">
        <span class="text-2xl font-bold text-orange-500">{{ storeSettingsService.current.storeName | uppercase }}</span>
        <p class="text-lg text-gray-500 dark:text-gray-400 mt-1">Sign in and continue shopping</p>
      </div>

      <!-- Tab Toggle -->
      <div class="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button class="flex-1 py-2 text-sm font-medium rounded-md transition-all"
          [class.bg-white]="loginMode === 'email'"
          [class.shadow]="loginMode === 'email'"
          [class.text-orange-600]="loginMode === 'email'"
          [class.text-gray-500]="loginMode !== 'email'"
          (click)="loginMode = 'email'">
          Email & Password
        </button>
        <button class="flex-1 py-2 text-sm font-medium rounded-md transition-all"
          [class.bg-white]="loginMode === 'phone'"
          [class.shadow]="loginMode === 'phone'"
          [class.text-orange-600]="loginMode === 'phone'"
          [class.text-gray-500]="loginMode !== 'phone'"
          (click)="loginMode = 'phone'">
          Phone OTP
        </button>
      </div>

      <!-- Email + Password Mode -->
      @if(loginMode === 'email') {
      <div class="space-y-6">
        <div>
          <label for="email1" class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
          <input pInputText id="email1" type="text" placeholder="Email address" class="w-full" [(ngModel)]="email" />
        </div>

        <div>
          <label for="password1" class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Password</label>
          <p-password [(ngModel)]="password" id="password1" placeholder="Password" #passwordInput name="password"
            [toggleMask]="true" [feedback]="false" [inputStyle]="{ width: '100%' }" styleClass="w-full"></p-password>
        </div>

        <div class="flex justify-between items-center text-sm">
          <div class="flex items-center">
            <p-checkbox [(ngModel)]="checked" id="rememberme1" binary class="mr-2"></p-checkbox>
            <label for="rememberme1" class="text-gray-600 dark:text-gray-400">Remember me</label>
          </div>
          <a class="font-medium hover:underline cursor-pointer" (click)="isForgotPasswordFlow = true">Forgot password?</a>
        </div>

        <p-button label="Sign In" styleClass="w-full" (click)="onLogin()"></p-button>
      </div>
      }

      <!-- Phone OTP Mode -->
      @if(loginMode === 'phone') {
      <div class="space-y-6">
        @if(!otpSent) {
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700">Phone Number</label>
            <div class="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-1 focus-within:ring-orange-500">
              <span class="text-gray-500 mr-2">+91</span>
              <input pInputText type="tel" [(ngModel)]="phoneNumber" placeholder="Enter mobile number"
                class="w-full border-0 outline-none" style="border: none; box-shadow: none;" />
            </div>
          </div>
          <p-button label="Send OTP" styleClass="w-full" [loading]="otpLoading" (click)="sendPhoneOtp()"></p-button>
        }

        @if(otpSent) {
          <div class="text-center">
            <p class="text-sm text-gray-600">OTP sent to</p>
            <p class="font-medium text-gray-900">+91 {{ phoneNumber }}</p>
          </div>
          <div class="flex justify-center">
            <p-inputOtp [(ngModel)]="phoneOtp" [length]="6" [integerOnly]="true"></p-inputOtp>
          </div>
          <p-button label="Verify & Sign In" styleClass="w-full" [loading]="otpLoading" (click)="verifyPhoneOtpLogin()"></p-button>
          <div class="flex justify-between items-center text-sm">
            @if(otpCountdown > 0) {
              <span class="text-gray-500">Resend in {{ otpCountdown }}s</span>
            }
            @if(otpCountdown === 0) {
              <button (click)="sendPhoneOtp()" class="text-orange-500 font-medium">Resend OTP</button>
            }
            <button (click)="otpSent = false; phoneOtp = ''" class="text-gray-500">Change Number</button>
          </div>
        }
      </div>
      }

      <p-divider align="center" styleClass="my-4">
        <span class="text-gray-400 text-sm">or</span>
      </p-divider>

      <div class="text-center">
        <span class="text-sm text-gray-600">Don't have an account? </span>
        <a routerLink="/auth/signup" class="text-sm font-medium text-orange-500 hover:underline">Sign Up</a>
      </div>
    </div>
    }

    <!-- FORGOT PASSWORD FLOW -->
    @if(isForgotPasswordFlow) {
    <div class="w-full max-w-md mx-auto bg-white dark:bg-surface-900 p-6 sm:p-8 rounded-2xl shadow-lg">
      <div class="text-center mb-6">
        <span class="text-2xl font-bold text-orange-500">{{ storeSettingsService.current.storeName | uppercase }}</span>
        <h2 class="text-lg text-gray-500 mt-1">Forgot Password</h2>
      </div>
      <div class="space-y-4">
        @if(forgotStep === 1) {
          <div>
            <p-floatlabel variant="on" class="w-full">
              <input pInputText id="forgot_email" [(ngModel)]="forgotEmail" class="w-full" autocomplete="off" />
              <label for="forgot_email">Email</label>
            </p-floatlabel>
            <p-button label="Send OTP" class="flex w-full mt-3" (click)="sendForgotOtp()"></p-button>
          </div>
        }
        @if(forgotStep === 2) {
          <div>
            <p-floatlabel variant="on" class="w-full">
              <input pInputText id="otp" [(ngModel)]="forgotOtp" autocomplete="off" class="w-full" />
              <label for="otp">Enter OTP sent to {{ forgotEmail }}</label>
            </p-floatlabel>
            <p-button label="Verify OTP" class="w-full mt-3 flex" (click)="verifyForgotOtp()"></p-button>
          </div>
        }
        @if(forgotStep === 3) {
          <div>
            <p-floatlabel variant="on" class="w-full mb-2">
              <p-password id="new_password" [inputStyle]="{ width: '100%' }" [(ngModel)]="newPassword" toggleMask="true" feedback="true" class="w-full"></p-password>
              <label for="new_password">New Password</label>
            </p-floatlabel>
            <p-floatlabel variant="on" class="w-full">
              <p-password id="confirm_password" [inputStyle]="{ width: '100%' }" [(ngModel)]="confirmPassword" toggleMask="true" feedback="true" class="w-full"></p-password>
              <label for="confirm_password">Confirm Password</label>
            </p-floatlabel>
            <p-button label="Reset Password" class="flex w-full mt-3" (click)="resetPassword()"></p-button>
          </div>
        }
        <div class="text-center mt-4">
          <a class="text-sm underline cursor-pointer text-orange-500" (click)="cancelForgotPassword()">Back to Login</a>
        </div>
      </div>
    </div>
    }
    `
})
export class LoginComponent implements OnInit {
    email = '';
    password = '';
    checked = false;

    loginMode: 'email' | 'phone' = 'email';

    phoneNumber = '';
    phoneOtp = '';
    otpSent = false;
    otpLoading = false;
    otpCountdown = 0;
    private otpTimer: any;

    isForgotPasswordFlow = false;
    forgotStep = 1;
    forgotEmail = '';
    forgotOtp = '';
    newPassword = '';
    confirmPassword = '';

    @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;

    constructor(
        private loginService: LoginService,
        private router: Router,
        private jwtHelper: JwtHelper,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private cartService: CartService,
        public storeSettingsService: StoreSettingsService
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['email']) {
                this.email = params['email'];
                setTimeout(() => this.passwordInput?.nativeElement.focus(), 200);
            }
        });
    }

    private handleLoginSuccess(res: any) {
        const token = res?.token;
        if (token) {
            localStorage.setItem('authToken', token);
            localStorage.setItem('isLoggedIn', 'true');
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
    }

    onLogin() {
        if (!this.email || !this.password) {
            this.messageService.add({ key: 'global', severity: 'warn', summary: 'Required', detail: 'Please enter email and password' });
            return;
        }

        this.loginService.loginUser({ email: this.email, password: this.password }).subscribe({
            next: (res) => {
                this.messageService.add({ key: 'global', severity: 'success', summary: 'Welcome!', detail: 'Logged in successfully' });
                this.handleLoginSuccess(res);
                this.email = '';
                this.password = '';
            },
            error: () => {
                this.messageService.add({ key: 'global', severity: 'error', summary: 'Login Failed', detail: 'Invalid email or password' });
            }
        });
    }

    sendPhoneOtp() {
        if (!this.phoneNumber || this.phoneNumber.length < 10) {
            this.messageService.add({ key: 'global', severity: 'warn', summary: 'Required', detail: 'Enter a valid 10-digit phone number' });
            return;
        }

        this.otpLoading = true;
        this.loginService.sendPhoneOtp(this.phoneNumber).subscribe({
            next: () => {
                this.otpLoading = false;
                this.otpSent = true;
                this.startOtpTimer();
                this.messageService.add({ key: 'global', severity: 'success', summary: 'OTP Sent', detail: 'Check your phone for the OTP' });
            },
            error: (err) => {
                this.otpLoading = false;
                this.messageService.add({ key: 'global', severity: 'error', summary: 'Failed', detail: err.error?.message || 'Failed to send OTP' });
            }
        });
    }

    verifyPhoneOtpLogin() {
        if (!this.phoneOtp || this.phoneOtp.length !== 6) {
            this.messageService.add({ key: 'global', severity: 'warn', summary: 'Required', detail: 'Enter the 6-digit OTP' });
            return;
        }

        this.otpLoading = true;
        this.loginService.verifyPhoneOtp(this.phoneNumber, this.phoneOtp).subscribe({
            next: (res) => {
                this.otpLoading = false;
                this.messageService.add({ key: 'global', severity: 'success', summary: 'Welcome!', detail: 'Logged in successfully' });
                this.handleLoginSuccess(res);
                this.phoneNumber = '';
                this.phoneOtp = '';
                this.otpSent = false;
            },
            error: (err) => {
                this.otpLoading = false;
                this.messageService.add({ key: 'global', severity: 'error', summary: 'Failed', detail: err.error?.message || 'Invalid or expired OTP' });
            }
        });
    }

    startOtpTimer() {
        this.otpCountdown = 30;
        clearInterval(this.otpTimer);
        this.otpTimer = setInterval(() => {
            this.otpCountdown--;
            if (this.otpCountdown <= 0) clearInterval(this.otpTimer);
        }, 1000);
    }

    sendForgotOtp() {
        if (!this.forgotEmail) {
            this.messageService.add({ key: 'global', severity: 'warn', summary: 'Required', detail: 'Please enter your email' });
            return;
        }
        this.loginService.sendForgotOtp(this.forgotEmail).subscribe({
            next: () => {
                this.messageService.add({ key: 'global', severity: 'success', summary: 'OTP Sent', detail: 'Check your email for the OTP' });
                this.forgotStep = 2;
            },
            error: () => {
                this.messageService.add({ key: 'global', severity: 'error', summary: 'Error', detail: 'Failed to send OTP' });
            }
        });
    }

    verifyForgotOtp() {
        this.loginService.verifyOtp(this.forgotEmail, this.forgotOtp).subscribe({
            next: () => {
                this.messageService.add({ key: 'global', severity: 'success', summary: 'OTP Verified', detail: 'Now reset your password' });
                this.forgotStep = 3;
            },
            error: () => {
                this.messageService.add({ key: 'global', severity: 'error', summary: 'Invalid OTP', detail: 'Check your OTP and try again' });
            }
        });
    }

    resetPassword() {
        if (this.newPassword !== this.confirmPassword) {
            this.messageService.add({ key: 'global', severity: 'warn', summary: 'Mismatch', detail: 'Passwords do not match' });
            return;
        }
        this.loginService.resetPassword(this.forgotEmail, this.forgotOtp, this.newPassword).subscribe({
            next: () => {
                this.messageService.add({ key: 'global', severity: 'success', summary: 'Password Reset', detail: 'Please login with your new password' });
                this.cancelForgotPassword();
            },
            error: () => {
                this.messageService.add({ key: 'global', severity: 'error', summary: 'Failed', detail: 'Could not reset password' });
            }
        });
    }

    cancelForgotPassword() {
        this.isForgotPasswordFlow = false;
        this.forgotStep = 1;
        this.forgotEmail = '';
        this.forgotOtp = '';
        this.newPassword = '';
        this.confirmPassword = '';
    }
}
