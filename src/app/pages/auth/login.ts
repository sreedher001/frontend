import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { LoginRequest, LoginService } from './login.service';
import { JwtHelper } from '@/jwt/jwt-helper';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CartService } from '../cart/cart.service';



@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule,FloatLabelModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule,CommonModule], //AppFloatingConfigurator
    template: `
        <!-- <app-floating-configurator /> -->
       @if(!isForgotPasswordFlow){ <div class="w-full max-w-md mx-auto bg-white dark:bg-surface-900 p-6 sm:p-8 rounded-2xl shadow-lg">
  <div class="text-center mb-6">
    <!-- <img
      src="/assets/images/logo.png"
      alt="ZFC Logo"
      class="mx-auto mb-4 w-24 sm:w-32 h-auto object-contain"
    />--><span class="my-title">ZFC</span> 
    <!-- <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0">Welcome to ZFC</h2> -->
    <p class="text-lg text-gray-500 dark:text-gray-400">Sign in and continue shopping</p>
  </div>

  <div class="space-y-6">
    <div>
      <label for="email1" class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
      <input
        pInputText
        id="email1"
        type="text"
        placeholder="Email address"
        class="w-full"
        [(ngModel)]="email"
      />
    </div>

    <div>
      <label for="password1" class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Password</label>
      <p-password
  [(ngModel)]="password"
  id="password1"
  placeholder="Password" #passwordInput name="password"
  [toggleMask]="true"
  [feedback]="false"
  [inputStyle]="{ width: '100%' }"
  styleClass="w-full"
></p-password>
    </div>

    <div class="flex justify-between items-center text-sm">
      <div class="flex items-center">
        <p-checkbox
          [(ngModel)]="checked"
          id="rememberme1"
          binary
          class="mr-2"
        ></p-checkbox>
        <label for="rememberme1" class="text-gray-600 dark:text-gray-400">Remember me</label>
      </div>
      <a class="font-medium hover:underline cursor-pointer" (click)="isForgotPasswordFlow = true">Forgot password?</a>

    </div>

    <p-button 
      label="Sign In"
      styleClass="w-full"
      (click)="onLogin()"
    ></p-button>

    <p-button outlined
      label="Sign in with OTP"
      styleClass="w-full mt-4"
      (click)="onOTPSignin()"
    ></p-button>
  </div>

</div>}
 <!-- FORGOT PASSWORD FLOW -->
@if(isForgotPasswordFlow){
  <div class="w-full max-w-md mx-auto bg-white dark:bg-surface-900 p-6 sm:p-8 rounded-2xl shadow-lg">
  <div class="text-center mb-6">
    <img
      src="/assets/images/logo.png"
      alt="ZFC Logo"
      class="mx-auto mb-4 w-24 sm:w-32 h-auto object-contain"
    />
    <!-- <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0">Welcome to ZFC</h2> -->
    <h2 class="text-lg text-gray-500 dark:text-gray-400">Forgot Password</h2>
  </div>
  <div  class="space-y-4">

  <!-- Step 1: Enter Email -->
  @if(forgotStep === 1){<div>
    <p-floatlabel variant="on" class="w-full">
  <input pInputText id="forgot_email" [(ngModel)]="forgotEmail" class="w-full" autocomplete="off" />
  <label for="forgot_email">Email</label>
</p-floatlabel>

<p-button   label="Send OTP" class="flex w-full mt-3" (click)="sendOtp()"></p-button>

  </div>}

  <!-- Step 2: Enter OTP -->
  @if(forgotStep === 2){<div>
    <p-floatlabel variant="on" class="w-full">
  <input
    pInputText
    id="otp"
    [(ngModel)]="forgotOtp"
    autocomplete="off"
    class="w-full"
  />
  <label for="otp">Enter OTP sent to {{ forgotEmail }}</label>
</p-floatlabel>

<p-button
   
  label="Verify OTP"
  class="w-full mt-3 flex"
  (click)="verifyOtp()"
></p-button>

  </div>}

  <!-- Step 3: Reset Password -->
  @if(forgotStep === 3){<div >
    <p-floatlabel variant="on" class="w-full mb-2">
  <p-password id="new_password" [inputStyle]="{ width: '100%' }" [(ngModel)]="newPassword" toggleMask="true" feedback="true" class="w-full"></p-password>
  <label for="new_password">New Password</label>
</p-floatlabel>

<p-floatlabel variant="on" class="w-full">
  <p-password id="confirm_password" [inputStyle]="{ width: '100%' }" [(ngModel)]="confirmPassword" toggleMask="true" feedback="true" class="w-full"></p-password>
  <label for="confirm_password">Confirm Password</label>
</p-floatlabel>

<p-button  label="Reset Password" class="flex w-full mt-3" (click)="resetPassword()"></p-button>

  </div>}

  <div class="text-center mt-4">
    <a class="text-sm underline cursor-pointer text-orange-500" (click)="cancelForgotPassword()">Back to Login</a>
  </div>
  </div>
</div>}



`
})
export class LoginComponent implements OnInit {
  @Output() loginSuccess = new EventEmitter<any>();
    email: string = '';

    password: string = '';

    checked: boolean = false;


    isForgotPasswordFlow = false;
forgotStep = 1;

forgotEmail = '';
forgotOtp = '';
newPassword = '';
confirmPassword = '';

 @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;
    constructor(private loginService: LoginService, private router: Router, private jwtHelper: JwtHelper, 
      private messageService: MessageService,private route: ActivatedRoute, private cartService: CartService) { }

    ngOnInit() {
  this.route.queryParams.subscribe(params => {
    if (params['email']) {
      this.email = params['email'];

      // Optional: focus password
      setTimeout(() => {
        this.passwordInput?.nativeElement.focus();
      }, 200);
    }
  });
}

  

    // onLogin() {
    //     const loginPayload: LoginRequest = {
    //         email: this.email,
    //         password: this.password
    //     };

    //     this.loginService.loginUser(loginPayload).subscribe({
    //         next: (res) => {
              
    //             this.messageService.add({
    //                 key: 'global',
    //                 severity: 'secondary',
    //                 summary: 'TADA! You’re in!',
    //                 //detail: err.error?.message || 'Username/password is incorrect'
    //                 detail:'Welcome to ZFC — ready to shop? Let’s go!',
    //                 sticky:false
    //             });
    //             const token = res?.token; // Make sure `res.token` contains the JWT
    //             if (token) {
    //                 localStorage.setItem('authToken', token);
    //                 localStorage.setItem('isLoggedIn', "true");
    //                 const userInfo = this.jwtHelper.getUserInfo();
    //                 localStorage.setItem('userName', userInfo?.name);
    //             }

    //             this.router.navigate(['/']);
    //             this.email = "";
    //             this.password = "";
    //             this.loginSuccess.emit(res);
    //         },
    //         error: (err) => {

    //             this.email = "";
    //             this.password = "";
    //             this.messageService.add({
    //                 key: 'global',
    //                 severity: 'error',
    //                 summary: 'Login Failed',
    //                 //detail: err.error?.message || 'Username/password is incorrect'
    //                 detail:'Username/password is incorrect',
    //                 sticky:true
    //             });

    //         }
    //     });
    // }


    onLogin() {
  const loginPayload: LoginRequest = {
    email: this.email,
    password: this.password
  };

  this.loginService.loginUser(loginPayload).subscribe({
    next: (res) => {

      this.messageService.add({
        key: 'global',
        severity: 'secondary',
        summary: 'TADA! You’re in!',
        detail: 'Welcome to ZFC — ready to shop? Let’s go!',
        sticky: false
      });

      const token = res?.token;

      if (token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('isLoggedIn', "true");

        const userInfo = this.jwtHelper.getUserInfo();
        localStorage.setItem('userName', userInfo?.name);
      }

      //const guestId = localStorage.getItem('guestId');

      //  STEP 1: MERGE CART
      this.cartService.mergeCart().subscribe({
        next: () => {

          //  STEP 2: Refresh cart
          this.cartService.getCart().subscribe();

          //  STEP 3: Optional cleanup
          localStorage.removeItem('guestId');

          //  STEP 4: Navigate AFTER merge
          this.router.navigate(['/']);
        },
        error: (err:any) => {
          console.error('Merge failed', err);

          // fallback → still navigate
          this.router.navigate(['/']);
        }
      });

      this.email = "";
      this.password = "";
      this.loginSuccess.emit(res);
    },

    error: (err) => {

      this.email = "";
      this.password = "";

      this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'Login Failed',
        detail: 'Username/password is incorrect',
        sticky: true
      });
    }
  });
}

onOTPSignin(){
  this.router.navigate(['/auth/login']);
}

sendOtp() {
  console.log(this.forgotEmail,"forgotmail");
  if (!this.forgotEmail) {
    this.messageService.add({ key:'global', severity: 'warn', summary: 'Email Required', detail: 'Please enter your email' });
    return;
  }

  this.loginService.sendForgotOtp(this.forgotEmail).subscribe({
    next: () => {
      this.messageService.add({ key:'global', severity: 'success', summary: 'OTP Sent', detail: 'Check your email for the OTP' });
      this.forgotStep = 2;
    },
    error: () => {
      this.messageService.add({ key:'global', severity: 'error', summary: 'Error', detail: 'Failed to send OTP' });
    }
  });
}

verifyOtp() {
  this.loginService.verifyOtp(this.forgotEmail, this.forgotOtp).subscribe({
    next: () => {
      this.messageService.add({ key:'global',severity: 'success', summary: 'OTP Verified', detail: 'Now reset your password' });
      this.forgotStep = 3;
    },
    error: () => {
      this.messageService.add({ key:'global',severity: 'error', summary: 'Invalid OTP', detail: 'Check your OTP and try again' });
    }
  });
}

resetPassword() {
  if (this.newPassword !== this.confirmPassword) {
    this.messageService.add({ key:'global',severity: 'warn', summary: 'Password Mismatch', detail: 'Passwords do not match' });
    return;
  }

  this.loginService.resetPassword(this.forgotEmail, this.forgotOtp, this.newPassword).subscribe({
    next: () => {
      this.messageService.add({ key:'global',severity: 'success', summary: 'Password Reset', detail: 'Please login with your new password' });
      this.cancelForgotPassword();
    },
    error: () => {
      this.messageService.add({ key:'global',severity: 'error', summary: 'Reset Failed', detail: 'Could not reset password' });
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
