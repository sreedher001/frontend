import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { JwtHelper } from '@/jwt/jwt-helper';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, ButtonModule, AvatarModule, DividerModule,
    CardModule, InputTextModule, ToastModule, FormsModule
  ],
  providers: [MessageService],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  user = { id: 0, name: '', email: '', phone: '' };
  editable = { email: '', phone: '' };
  editing = { email: false, phone: false };
  valid = { email: false, phone: false };
  otpVisible = { email: false, phone: false };
  otp = { email: '', phone: '' };

  constructor(private jwtHelper: JwtHelper, private messageService: MessageService,private profileService:ProfileService) {}

  ngOnInit(): void {
    const userDetails = this.jwtHelper.getUserDetails();
    if (userDetails) {
      this.user = userDetails;
    }
  }

  enableEdit(field: 'email' | 'phone') {
    this.editing[field] = true;
    this.editable[field] = this.user[field];
  }

  cancelEdit(field: 'email' | 'phone') {
    this.editing[field] = false;
    this.otpVisible[field] = false;
    this.otp[field] = '';
  }
  attempted = { email: false, phone: false };

  // validateField(field: 'email' | 'phone') {
  //   if (field === 'email') {
  //     this.valid.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.editable.email);
  //   } else {
  //     this.valid.phone = /^[6-9]\d{9}$/.test(this.editable.phone);
  //   }
  // }

  validateAndSendOtp(field: 'email' | 'phone') {
  this.attempted[field] = true;

  if (field === 'email') {
    this.valid.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.editable.email);
    if (!this.valid.email) {
      this.messageService.add({ key: 'global', severity: 'warn', summary: 'Invalid email format' });
      return;
    }
  } else {
    this.valid.phone = /^[6-9]\d{9}$/.test(this.editable.phone);
    if (!this.valid.phone) {
      this.messageService.add({ key: 'global', severity: 'warn', summary: 'Invalid phone number' });
      return;
    }
  }

  this.sendOtp(field);
}

  sendOtp(field: 'email' | 'phone') {
    this.profileService.sendOtp(field, this.editable[field]).subscribe({
      next: () => {
        this.otpVisible[field] = true;
        this.messageService.add({ key: 'global', severity: 'success', summary: `OTP sent to ${field}` });
      },
      error: () => {
        this.messageService.add({ key: 'global', severity: 'error', summary: `Failed to send OTP for ${field}` });
      }
    });
  }

  verifyOtp(field: 'email' | 'phone') {
    this.profileService.verifyOtp(field, this.editable[field], this.otp[field]).subscribe({
      next: () => {
        this.user[field] = this.editable[field];
        this.editing[field] = false;
        this.otpVisible[field] = false;
        this.messageService.add({ key: 'global', severity: 'success', summary: `${field} updated successfully!` });
      },
      error: () => {
        this.messageService.add({ key: 'global', severity: 'error', summary: 'Invalid OTP. Please try again.' });
      }
    });
  }
}
