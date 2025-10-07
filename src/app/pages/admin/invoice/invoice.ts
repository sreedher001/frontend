import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Fluid, FluidModule } from "primeng/fluid";
import { InvoiceService } from './invoice.service';
import { InputTextModule } from 'primeng/inputtext';
import { CellEditor, TableModule } from 'primeng/table';
import { TreeTableCellEditor } from 'primeng/treetable';
import { TooltipModule } from 'primeng/tooltip';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-invoice',
  imports: [FileUploadModule, FloatLabelModule, DatePickerModule, FormsModule,ButtonModule,
    InputTextModule,FluidModule,TableModule,TooltipModule,InputTextModule,InputGroupAddonModule,InputNumberModule],
  templateUrl: './invoice.html',
  styleUrl: './invoice.scss'
})
export class Invoice implements OnInit{

  constructor(private invoiceService:InvoiceService,private messageService:MessageService){}
  ngOnInit(): void {
  }

  @ViewChild('invoiceForm') invoiceForm!: NgForm;
  // Optional: match fileName or separate
  file: File | null = null;     // Actual uploaded file
  fileName: string = '';
  s3Url?: string;
  vendorName: string = '';
  amount: number | null = null;
  currency: string = 'INR';
  invoiceDate: Date | null = null;
  category: string = '';
  paymentMethod: string = '';
  tags: string = '';


  invoice: any = {
    vendorName: '',
    invoiceDate: null,
    amount: 0,
    file: null,
    fileName: '',
    currency: 'INR',
    category: '',
    paymentMethod: '',
    tags: '',
    invoiceItem:[]
  };

  uploadedFile: File | null = null;

  onFileUpload(event: any) {
    const file = event.files[0];
    this.uploadedFile = file;
    console.log('Selected file:', file);
  }

  onFileSelect(event: any){
const file = event.files[0];
    this.uploadedFile = file;
    console.log('Selected file:', this.uploadedFile);
  }

  onFileClear(event: any){
    this.uploadedFile = null;
console.log('removed file:', this.uploadedFile);
  }

  onSubmit() {
    console.log(this.invoiceForm);
  if (!this.invoiceForm.valid || !this.uploadedFile) {
    console.warn('Missing fields');
    return;
  }

  const metadata = {
    vendorName: this.invoice.vendorName,
    invoiceDate: this.invoice.invoiceDate?.toISOString().split('T')[0] || '',
    amount: this.invoice.amount,
    currency: this.invoice.currency,
    category: this.invoice.category,
    paymentMethod: this.invoice.paymentMethod,
    tags: this.invoice.tags,
    invoiceItem: this.invoice.invoiceItem
  };

  const formData = new FormData();
  formData.append('file', this.uploadedFile!);
  formData.append('metadata', JSON.stringify(metadata));


  this.invoiceService.uploadInvoice(formData).subscribe({
    next: (res:any) =>{
      console.log('Success', res)
      this.messageService.add({

        key:'global',
        icon:'pi pi-check',
        severity:'success',
        summary:'Success!',
        detail:'Invoice added successfully.'

      });
      this.invoiceForm.resetForm();
      this.uploadedFile=null;
      this,this.invoice.invoiceItem=null;
    },
    error: (err:any) => {
      console.error('Error', err)
      this.messageService.add({

        key:'global',
        icon:'pi pi-check',
        severity:'danger',
        summary:'Failed!',
        detail:err.error.message?err.error.message:'Failed to upload invoice!'

      });
    }
  });
}

removeItem(item: any) {
    this.invoice.invoiceItem = this.invoice.invoiceItem.filter((i: any) => i !== item);
  }
  addInvoiceItem() {
    const item = {
      itemName: '',
      price: 0,
      quantity: 0
    };
    this.invoice.invoiceItem.push(item);
  }
}