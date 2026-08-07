import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { StoreSettings } from '@/store-settings/store-settings.model';
import { StoreSettingsService } from '@/store-settings/store-settings.service';
import { ResolveImagePipe } from '@/shared/resolve-image.pipe';

@Component({
  selector: 'app-admin-store-settings',
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, TextareaModule, ToastModule, ResolveImagePipe],
  templateUrl: './admin-store-settings.html'
})
export class AdminStoreSettings implements OnInit {
  loading = false;
  saving = false;
  uploadingLogo = false;
  uploadingFavicon = false;
  form: StoreSettings = this.emptyForm();

  constructor(private storeSettingsService: StoreSettingsService, private messageService: MessageService) {}

  ngOnInit() {
    this.loading = true;
    this.form = { ...this.storeSettingsService.current };
    this.loading = false;
  }

  emptyForm(): StoreSettings {
    return {
      storeName: '', tagline: '', aboutDescription: '', logoUrl: '', faviconUrl: '',
      supportEmail: '', supportPhone: '', addressLine: '', city: '', state: '', country: '', postalCode: '',
      instagramUrl: null, facebookUrl: null, twitterUrl: null, linkedinUrl: null,
      websiteDomain: '', seoTitle: '', seoDescription: '', currencySymbol: '₹', primaryColor: '#c2410c'
    };
  }

  onLogoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.uploadingLogo = true;
    this.storeSettingsService.uploadImage(file).subscribe({
      next: (res) => {
        this.form.logoUrl = res.url;
        this.uploadingLogo = false;
      },
      error: (err) => {
        this.uploadingLogo = false;
        this.messageService.add({ key: 'global', severity: 'error', summary: 'Upload failed', detail: err?.error?.message || 'Could not upload logo' });
      }
    });
  }

  onFaviconSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.uploadingFavicon = true;
    this.storeSettingsService.uploadImage(file).subscribe({
      next: (res) => {
        this.form.faviconUrl = res.url;
        this.uploadingFavicon = false;
      },
      error: (err) => {
        this.uploadingFavicon = false;
        this.messageService.add({ key: 'global', severity: 'error', summary: 'Upload failed', detail: err?.error?.message || 'Could not upload favicon' });
      }
    });
  }

  save() {
    if (!this.form.storeName?.trim()) {
      this.messageService.add({ key: 'global', severity: 'warn', summary: 'Store name required', detail: 'Store name cannot be empty' });
      return;
    }

    this.saving = true;
    this.storeSettingsService.update(this.form).subscribe({
      next: () => {
        this.saving = false;
        this.messageService.add({ key: 'global', severity: 'success', summary: 'Saved', detail: 'Store settings updated successfully' });
      },
      error: (err) => {
        this.saving = false;
        this.messageService.add({ key: 'global', severity: 'error', summary: 'Error', detail: err?.error?.message || 'Failed to save store settings' });
      }
    });
  }
}
