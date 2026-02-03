import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Return } from './return';
import { AdminReturn } from './return.modal';
import { CardModule } from 'primeng/card';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-returns',
  imports: [TableModule,
    ButtonModule,
    TagModule,CardModule,DialogModule,InputTextModule,CommonModule,

    ProgressSpinnerModule,AutoCompleteModule,FormsModule,ConfirmDialogModule],
     providers: [ConfirmationService],
  templateUrl: './admin-returns.html',
  styleUrl: './admin-returns.scss'
})
export class AdminReturns {
returns: AdminReturn[] = [];
  
loading = false;
showCommentModal = false;
commentAction!: 'APPROVE' | 'REJECT' | 'QC_PASS' | 'QC_FAIL'|'REFUND_COMPLETED';
activeReturn!: AdminReturn;
commentText = '';

page = 0;
size = 10;
totalRecords = 0;
  statuses = [
    'REQUESTED',
    'APPROVED',
    'PICKED',
    'RECEIVED_AT_WAREHOUSE','MANUAL_ACTION_REQUIRED',
    'QC_PASSED',
    'QC_FAILED',
    'REFUND_INITIATED',
    'REFUND_COMPLETED',
    'CLOSED'
  ];

  selectedStatus: string ='REQUESTED';
  filteredStatuses: string[] = [];
  filterStatus(event: any) {
  const query = event.query.toLowerCase();
  this.filteredStatuses = this.statuses.filter(s =>
    s.toLowerCase().includes(query)
  );
}

  constructor(private returnService: Return,private confirmationService: ConfirmationService,private router: Router
) {}

  ngOnInit() {
    this.loadReturns();
  }
goToOrderDetails(orderId: number) {
  this.router.navigate(['/admin/order-details', orderId]);
}
  loadReturns(event?: any) {
  this.loading = true;

  if (event) {
    this.page = event.first / event.rows;
    this.size = event.rows;
  }

  this.returnService
    .getAllReturns(this.selectedStatus, this.page, this.size)
    .subscribe({
      next: (res:any) => {
        this.returns = res.content;
        this.totalRecords = res.totalElements;
        this.loading = false;
      },
      error: () => this.loading = false
    });
}

approve(r: AdminReturn) {
  this.returnService.approve(r.returnId, 'Approved')
    .subscribe(() => this.loadReturns());
}

reject(r: AdminReturn) {
  this.returnService.reject(r.returnId, 'Rejected')
    .subscribe(() => this.loadReturns());
}

markReceived(r: AdminReturn) {
  this.returnService.received(r.returnId)
    .subscribe(() => this.loadReturns());
}

qcPass(r: AdminReturn) {
  this.returnService.qc(r.returnId, true, 'QC passed')
    .subscribe(() => this.loadReturns());
}

qcFail(r: AdminReturn) {
  this.returnService.qc(r.returnId, false, 'QC failed')
    .subscribe(() => this.loadReturns());
}

initiateRefund(r: AdminReturn) {
  this.returnService.initiateRefund(r.returnId)
    .subscribe(() => this.loadReturns());
}



closeReturn(r: AdminReturn) {
  this.returnService.closeReturn(r.returnId)
    .subscribe(() => this.loadReturns());
}
viewReturn(returnId: number) {
  this.router.navigate(['/admin/returns', returnId]);
}

confirmApprove(r: AdminReturn) {
  this.confirmationService.confirm({
   // key:'global',
    header: 'Approve Return',
    message: `Are you sure you want to approve return #${r.orderNumber}?`,
    icon: 'pi pi-check',
    accept: () => this.openCommentModal('APPROVE', r)
  });
}

confirmClose(r: AdminReturn) {
  this.confirmationService.confirm({
   // key:'global',
    header: 'Close Return',
    message: 'This action is final. Continue?',
    icon: 'pi pi-exclamation-triangle',
    accept: () => this.closeReturn(r)
  });
}

openCommentModal(action: any, r: AdminReturn) {
  this.commentAction = action;
  this.activeReturn = r;
  this.commentText = '';
  this.showCommentModal = true;
}

submitCommentAction() {
  const id = this.activeReturn.returnId;
  switch (this.commentAction) {
    case 'APPROVE':
      this.returnService.approve(id, this.commentText)
        .subscribe(() => this.afterAction());
      break;

    case 'REJECT':
      this.returnService.reject(id, this.commentText)
        .subscribe(() => this.afterAction());
      break;

    case 'QC_PASS':
      this.returnService.qc(id, true, this.commentText)
        .subscribe(() => this.afterAction());
      break;

    case 'QC_FAIL':
      this.returnService.qc(id, false, this.commentText)
        .subscribe(() => this.afterAction());
      break;
    case 'REFUND_COMPLETED':
      this.returnService.refundCompleted(id, this.commentText)
        .subscribe(() => this.afterAction());
      break;

  }
}
refundComplete(r: AdminReturn) {
  this.returnService.refundCompleted(r.returnId, 'MANUAL_REF_001')
    .subscribe(() => this.loadReturns());
}
afterAction() {
  this.showCommentModal = false;
  this.loadReturns();
}
}
