import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BannerService, Banner } from './banner.service';
import { ConfirmDialog } from "primeng/confirmdialog";
import { isAllowedImageFile } from '@/shared/image-validation';
import { CommonService } from '@/layout/service/common';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';

export interface BannerUploadDto {
  title: string;
  redirectUrl: string;
  bannerType: string;
  purchaseType: string;
}

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [
    CommonModule,
    AutoCompleteModule,
    FormsModule, ButtonModule,
    ButtonModule,
    FileUploadModule,
    TableModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    ConfirmDialog,
    TooltipModule,
    SelectModule
],
  providers: [MessageService],
  templateUrl: './banner.html',
  styleUrl: './banner.scss',
})
export class BannerComponent implements OnInit {
  banners: Banner[] = [];
  showGuidelines = true;
  displayDialog = false;
  selectedFiles: File[] = [];
  selectedBannerId: number | null = null;
  bannerForm: BannerUploadDto = { title: '', redirectUrl: '', bannerType: '', purchaseType: 'BOTH' };

  // Autocomplete fields
  bannerTypes = ['Homepage', 'Offer', 'Festival'];
  filteredBannerTypes: string[] = [];

  purchaseTypeOptions = [
    { label: 'Both (Retail & Wholesale)', value: 'BOTH' },
    { label: 'Retail Only', value: 'RETAIL' },
    { label: 'Wholesale Only', value: 'WHOLESALE' }
  ];

  commonService = new CommonService();

  constructor(
    private bannerService: BannerService,
    private messageService: MessageService,private confirmationService: ConfirmationService
  ) {}

  resolveImageUrl(path: string): string {
    return this.commonService.resolveImageUrl(path);
  }

  ngOnInit(): void {
    this.loadBanners();
  }

  //  Load banners from backend
  loadBanners() {
    this.bannerService.getAllBanners().subscribe({
      next: (data) => (this.banners = data),
      error: (err) => console.error('Failed to load banners', err),
    });
  }

  //  Open Add Banner dialog
  openNew() {
    this.selectedBannerId = null;
    this.bannerForm = { title: '', redirectUrl: '', bannerType: '', purchaseType: 'BOTH' };
    this.selectedFiles = [];
    this.displayDialog = true;
  }

  //  File select handler
  onFileSelect(event: any) {
    const files: File[] = Array.from(event.target.files);
    const valid = files.filter(isAllowedImageFile);
    const rejected = files.filter(f => !isAllowedImageFile(f));

    if (rejected.length) {
      this.messageService.add({
        key: 'global',
        severity: 'warn',
        summary: 'Unsupported file',
        detail: `${rejected.map(f => f.name).join(', ')} isn't JPG, PNG, or WEBP`
      });
    }

    this.selectedFiles = valid;
  }

  //  Filter banner types for autocomplete
  filterBannerTypes(event: any) {
    const query = event.query.toLowerCase();
    this.filteredBannerTypes = this.bannerTypes.filter((type) =>
      type.toLowerCase().includes(query)
    );
  }

  //  Save banner (upload or update)
  uploadBanner() {
    if (!this.bannerForm.title || !this.bannerForm.bannerType) {
      this.messageService.add({
        key: 'global',
        severity: 'warn',
        summary: 'Validation',
        detail: 'Title and Banner Type are required.',
      });
      return;
    }

    if (this.selectedBannerId) {
      // Update existing banner
      this.bannerService
        .updateBanner(this.selectedBannerId, this.bannerForm)
        .subscribe({
          next: () => {
            this.messageService.add({
              key: 'global',
              severity: 'success',
              summary: 'Updated',
              detail: 'Banner updated successfully',
            });
            this.displayDialog = false;
            this.loadBanners();
          },
          error: (err) => {
            console.error('Update failed', err);
            this.messageService.add({
              key: 'global',
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update banner',
            });
          },
        });
    } else {
      // Upload new banner
      if (this.selectedFiles.length === 0) {
        this.messageService.add({
          key: 'global',
          severity: 'warn',
          summary: 'Validation',
          detail: 'Please select an image file.',
        });
        return;
      }

      this.bannerService
        .uploadBanner(this.selectedFiles, this.bannerForm)
        .subscribe({
          next: () => {
            this.messageService.add({
              key: 'global',
              severity: 'success',
              summary: 'Success',
              detail: 'Banner uploaded successfully',
            });
            this.displayDialog = false;
            this.loadBanners();
          },
          error: (err) => {
            console.error('Upload failed', err);
            this.messageService.add({
              key: 'global',
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to upload banner',
            });
          },
        });
    }
  }

  //  Edit banner
  editBanner(banner: Banner) {
    this.selectedBannerId = banner.id;
    this.bannerForm = {
      title: banner.title,
      redirectUrl: banner.redirectUrl,
      bannerType: banner.bannerType,
      purchaseType: banner.purchaseType || 'BOTH',
    };
    this.displayDialog = true;
  }

  //  Delete banner
 deleteBanner(id: number) {
  this.confirmationService.confirm({
    message: 'Are you sure you want to delete this banner?',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Yes',
    rejectLabel: 'No',
    accept: () => {
      this.bannerService.deleteBanner(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Banner deleted successfully',
          });
          this.loadBanners();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete banner',
          });
        },
      });
    },
    reject: () => {
      // optional: action on reject
    },
  });
}
}
