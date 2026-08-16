import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { CartService } from '../../cart/cart.service';
import { environment } from '../../../../environments/environment';
import { PasswordModule } from 'primeng/password';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm,ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputGroupModule } from 'primeng/inputgroup';
import { FluidModule } from 'primeng/fluid';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { ColorPickerModule } from 'primeng/colorpicker';
import { KnobModule } from 'primeng/knob';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TreeSelectModule } from 'primeng/treeselect';
import { MultiSelectModule } from 'primeng/multiselect';
import { ListboxModule } from 'primeng/listbox';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TextareaModule } from 'primeng/textarea';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MessageService, TreeNode } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { GalleriaModule } from 'primeng/galleria';
import { Tooltip, TooltipModule } from "primeng/tooltip";
import { DialogModule } from 'primeng/dialog';
import { Divider, DividerModule } from 'primeng/divider';
import { JwtHelper } from '@/jwt/jwt-helper';
import { InputOtpModule } from 'primeng/inputotp';

declare const google: any;

@Component({
  selector: 'app-signup',
  imports: [CommonModule,ReactiveFormsModule,InputOtpModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    RadioButtonModule,
    SelectButtonModule,
    InputGroupModule,
    FluidModule,
    IconFieldModule,
    InputIconModule,
    FloatLabelModule,
    AutoCompleteModule,
    InputNumberModule,
    SliderModule,
    RatingModule,
    ColorPickerModule,
    KnobModule,
    SelectModule,
    DatePickerModule,
    TooltipModule,
    ToggleButtonModule,
    ToggleSwitchModule,
    TreeSelectModule,
    TableModule,
    MultiSelectModule,
    ListboxModule,
    InputGroupAddonModule,
    TextareaModule, FileUploadModule, GalleriaModule,
    DialogModule,DividerModule,PasswordModule,MultiSelectModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})

export class Signup implements AfterViewInit {
displayOtpDialog: boolean = false;
  otpValue: string = '';
displayConfirmation: boolean = false;
  user = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    roles:[]=[]
  };
  loading = false;
    roleOptions = [
    { label: 'User', value: 'user' },
    { label: 'Moderator', value: 'mod' },
    { label: 'Admin', value: 'admin' }
  ];

  isAdmin: boolean = false;
acceptedTerms: boolean = false;
  constructor(
    private loginService: LoginService,
    private router: Router,
    private messageService: MessageService,private jwtHelper:JwtHelper,
    private cartService: CartService
  ) {
this.jwtHelper.getUserRoles().forEach(role=>{
  if(role==="ROLE_ADMIN"){
    this.isAdmin=true;
  }
});
  }

  ngAfterViewInit(): void {
    this.renderGoogleButton();
  }

  private renderGoogleButton(retriesLeft = 20): void {
    if (typeof google === 'undefined' || !google.accounts?.id) {
      // The GIS script loads async; give it a moment before giving up.
      if (retriesLeft > 0) {
        setTimeout(() => this.renderGoogleButton(retriesLeft - 1), 250);
      }
      return;
    }

    const target = document.getElementById('googleSignupBtn');
    if (!target) {
      return;
    }

    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: { credential: string }) => this.handleGoogleCredential(response)
    });

    google.accounts.id.renderButton(target, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'signup_with',
      shape: 'pill',
      width: 320
    });
  }

  private handleGoogleCredential(response: { credential: string }): void {
    this.loginService.googleAuth(response.credential).subscribe({
      next: (res: any) => {
        const token = res?.token;
        if (token) {
          localStorage.setItem('authToken', token);
          localStorage.setItem('isLoggedIn', 'true');
          const userInfo = this.jwtHelper.getUserInfo();
          localStorage.setItem('userName', userInfo?.name);
        }

        this.messageService.add({
          key: 'global',
          severity: 'success',
          summary: 'Welcome!',
          detail: 'Signed up with Google successfully'
        });

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
      },
      error: (err) => {
        this.messageService.add({
          key: 'global',
          severity: 'error',
          summary: 'Google Sign-Up Failed',
          detail: err?.error?.message || 'Could not sign up with Google. Please try again.',
          sticky: true
        });
      }
    });
  }

  onSubmit(signupForm: NgForm,) {
if (signupForm.invalid) {
      this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'Oops!',
        detail: 'Please fill all required fields..'
      });
      return;
    }

     //  Password mismatch check
  if (this.user.password !== this.user.confirmPassword) {
    this.messageService.add({
      key: 'global',
      severity: 'error',
      summary: 'Password Error',
      detail: 'Passwords do not match'
    });
    return;
  }

    if (signupForm.valid) {
      this.loading = true;
      const payload = {
        username: this.user.username,
        email: this.user.email,
        password: this.user.password,
        role: this.user.roles
      };
      this.loginService.signup(payload).subscribe({
        next: (res) => {
          this.loading = false;
          this.messageService.add({
        key: 'global',
        severity: 'success',
        summary: 'Account Created!',
        detail: 'Enter the OTP sent to your email to verify your account.',
      });
      this.displayOtpDialog = true;
        },
        error: (err) => {
          this.loading = false;
           this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'Oops!',
        detail: err.error.message,
        sticky:true
      });
        }
      });
    }
  }

  closeConfirmation() {
    this.displayConfirmation = false;
  }
  openConfirmation() {
    this.displayConfirmation = true;
  }

  submitOtp() {
  if (!this.otpValue || this.otpValue.length !== 6) {
    this.messageService.add({
      key: 'global',
      severity: 'error',
      summary: 'Invalid OTP',
      detail: 'Please enter a valid 6-digit OTP'
    });
    return;
  }

  this.loginService.verifyOtp(this.user.email,this.otpValue).subscribe({
    next: () => {
      this.messageService.add({
        key: 'global',
        severity: 'success',
        summary: 'Verified',
        detail: 'Account verified successfully'
      });

      this.displayOtpDialog = false;
      this.router.navigate(['/auth/login'], {
    queryParams: { email: this.user.email }
  });
    },
    error: (err) => {
      this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'OTP Failed',
        detail: err.error.message
      });
    }
  });
}

resendOtp() {
  this.loginService.sendForgotOtp(this.user.email).subscribe(() => {
    this.messageService.add({
      key: 'global',
      severity: 'info',
      summary: 'OTP Sent',
      detail: 'A new OTP has been sent to your email'
    });
  });
}

navigateToTandC(){
   this.router.navigate(['/terms-and-conditions']);
}
}


