import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ReelService } from './reel.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reel-component',
  imports: [TableModule,ButtonModule,FormsModule,DialogModule,InputTextModule,SelectModule,ToastModule,ConfirmDialogModule],
  templateUrl: './reel-component.html',
  styleUrl: './reel-component.scss',
})
export class ReelComponent implements OnInit {

  reels: any[] = [];
  variants: any[] = [];
  loading = false;

  displayDialog = false;
  isEdit = false;

  form: any = {};
  selectedId: number | null = null;

  constructor(
    private reelService: ReelService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadReels();
  }

  // Load Reels
  loadReels() {
    this.loading = true;

    this.reelService.getAllReels().subscribe({
      next: (res:any) => {
        this.reels = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  // Create
  openCreateDialog() {
    this.isEdit = false;
    this.form = {};
    this.displayDialog = true;
  }

  // Edit
  editReel(reel: any) {
    this.isEdit = true;
    this.selectedId = reel.id;

    this.form = {
      title: reel.title,
      caption: reel.caption,
      videoUrl: reel.videoUrl,
      thumbnailUrl: reel.thumbnailUrl,
      durationSeconds: reel.durationSeconds,
      variantId: reel.productVariant.id
    };

    this.displayDialog = true;
  }

  // Save
  saveReel() {

    const request = this.isEdit
      ? this.reelService.updateReel(this.selectedId!, this.form)
      : this.reelService.createReel(this.form);

    request.subscribe({
      next: () => {
        this.displayDialog = false;
        this.loadReels();

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Reel ${this.isEdit ? 'updated' : 'created'} successfully`
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Operation failed'
        });
      }
    });
  }

  //  Delete
  confirmDelete(id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this reel?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',

      accept: () => this.deleteReel(id)
    });
  }

  deleteReel(id: number) {
    this.reelService.deleteReel(id).subscribe(() => {
      this.loadReels();

      this.messageService.add({
        severity: 'success',
        summary: 'Deleted',
        detail: 'Reel deleted successfully'
      });
    });
  }
}
