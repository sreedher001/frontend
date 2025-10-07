
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { InvoiceService } from '../invoice/invoice.service';
import { DialogModule } from 'primeng/dialog';
import { Tooltip } from "primeng/tooltip";
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-invoicelist',
  imports: [TableModule,ConfirmDialogModule,  DatePipe, DialogModule, DatePickerModule, FormsModule, ButtonModule, FloatLabelModule, RouterModule, TagModule, Tooltip],
  templateUrl: './invoicelist.html',
  styleUrl: './invoicelist.scss'
})
export class Invoicelist {

  invoices: any[] = [];
  loading = false;
maxDate: Date = new Date();
  startDate: Date = new Date(); // default to today
  endDate: Date = new Date();   // default to today
  pageSize: number = 10;
  currentPage: number = 0;
  totalInvoices:number=0;

  selectedInvoice: any = null;
invoiceDialogVisible: boolean = false;

 constructor(
      private invoiceService: InvoiceService,
      private messageService: MessageService,private route: ActivatedRoute,
    private confirmationService: ConfirmationService
    ) {}
    ngOnInit(): void {
      this.loadInvoiceByDateRange(this.startDate, this.endDate);
    }


viewInvoice(invoice: any) {
    this.selectedInvoice = invoice;
    this.invoiceDialogVisible = true;
}

deleteInvoice(invoice: any) {
    // Optional confirmation dialog
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this invoice?.',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-warn ',
    rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.invoiceService.deleteInvoice(invoice.id).subscribe({
          next: () => {
            // Remove from UI
            this.invoices = this.invoices.filter(i => i.id !== invoice.id);
            this.messageService.add({key:"global", severity: 'success', summary: 'Deleted', detail: 'Invoice deleted successfully' });
            window.location.reload();
          },
          error: (err:any) => {
            this.messageService.add({ key:"global",severity: 'error', summary: 'Error', detail: 'Failed to delete invoice' });
            console.error(err);
          }
        });
      }
    });
  }
getTotal(items: any): number {
  return items.reduce((sum:any ,item:any) => sum + item.totalPrice, 0);
}


     loadInvoiceByDateRange(startDate: Date, endDate: Date, page: number = 0, size: number = 10): void {
  this.loading = true;
  const formatLocalDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-CA').format(date); // 'YYYY-MM-DD' in local timezone
  };

  const formattedStart = formatLocalDate(startDate);
  const formattedEnd = formatLocalDate(endDate);

  this.invoiceService.getInvoicesByDateRange(formattedStart, formattedEnd, page, size).subscribe({
    next: (response:any) => {
      this.invoices = response.content; // if using Spring Page object
      this.totalInvoices = response.totalElements;
      this.currentPage = response.number;
      this.pageSize = response.size;
      this.loading = false;
    },
    error: () => {
      this.loading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load orders for selected date range'
      });
    }
  });
}

onPageChange(event: any): void {
    this.loadInvoiceByDateRange(this.startDate, this.endDate, event.page, event.rows);
  }
}
