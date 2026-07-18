import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FluidModule } from 'primeng/fluid';
import { CheckboxModule } from 'primeng/checkbox';
import { RatingModule } from 'primeng/rating';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '@/pages/products/product.service';
import { Addproductservice } from '../addproduct/addproductservice';

@Component({
  selector: 'app-addvariant',
  imports: [
    CommonModule, FormsModule, ButtonModule, InputTextModule, InputNumberModule,
    SelectModule, FloatLabelModule, FluidModule, CheckboxModule, RatingModule,
    FileUploadModule, DialogModule, TextareaModule, TooltipModule,
    AutoCompleteModule, DragDropModule
  ],
  templateUrl: './addvariant.html',
  styleUrl: './addvariant.scss'
})
export class Addvariant implements OnInit {

  showeErrorSuggestion: boolean = false;
  showeErrorSuggestionFile: boolean = false;
  displayConfirmation: boolean = false;
  loading: boolean = true;
  maxFilesize: any;
  productFound: boolean = false;
  productParentId: any;

  productName: any[] | undefined;
  autoFilteredProductName: any[] = [];

  uploadedFiles: { file: File; preview: string }[] = [];

  unitOptions = [
    { label: 'Grams (g)', value: 'g' },
    { label: 'Kilograms (kg)', value: 'kg' },
    { label: 'Milliliters (ml)', value: 'ml' },
    { label: 'Liters (L)', value: 'L' },
    { label: 'Pieces (pcs)', value: 'pcs' },
    { label: 'Packets', value: 'pkts' },
    { label: 'Boxes', value: 'boxes' }
  ];

  product: any = {
    name: ''
  };

  variant: any = {
    variantName: '',
    weight: '',
    unit: 'g',
    sku: '',
    barcode: '',
    retailPrice: 0,
    wholesalePrice: 0,
    wholesaleEnabled: false,
    minWholesaleQuantity: null,
    wholesaleDiscount: null,
    availableQuantity: 0,
    lowStockThreshold: 5,
    rating: 3,
    isFeatured: false,
    variantDescription: ''
  };

  constructor(
    private route: Router,
    private productService: ProductService,
    private addProductService: Addproductservice,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.maxFilesize = 1000000;
    this.loading = true;
    this.getProductNames();
    this.loading = false;
  }

  getProductNames() {
    this.addProductService.getAllProductName().subscribe({
      next: (res: any) => {
        this.productName = res;
      }
    });
  }

  filterProductName(event: AutoCompleteCompleteEvent) {
    const query = event.query;
    const filtered: any[] = [];
    for (let i = 0; i < (this.productName as any[]).length; i++) {
      const item = (this.productName as any[])[i];
      if (item?.productName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(item);
      }
    }
    this.autoFilteredProductName = filtered;
  }

  onProductSelect(event: any) {
    const selected = event.value;
    if (selected && selected.productId) {
      this.productParentId = selected.productId;
      this.productFound = true;
      this.messageService.add({
        key: 'global', severity: 'success', summary: 'Product Found',
        detail: `Selected: ${selected.productName}. You can now add a variant.`
      });
    }
  }

  onSubmit(form: NgForm) {
    if (form.invalid || !this.productFound || this.uploadedFiles.length === 0) {
      this.messageService.add({
        key: 'global', severity: 'error', summary: 'Validation Error',
        detail: 'Please select a product, fill all required fields, and upload at least one image.'
      });
      this.showeErrorSuggestion = true;
      if (this.uploadedFiles.length === 0) this.showeErrorSuggestionFile = true;
      return;
    }
    this.openConfirmation();
  }

  closeConfirmation() { this.displayConfirmation = false; }
  openConfirmation() { this.displayConfirmation = true; }

  drop(event: CdkDragDrop<{ file: File; preview: string }[]>) {
    moveItemInArray(this.uploadedFiles, event.previousIndex, event.currentIndex);
  }

  removeFromOrderList(item: { file: File; preview: string }) {
    URL.revokeObjectURL(item.preview);
    this.uploadedFiles = this.uploadedFiles.filter(f => f !== item);
  }

  onFileSelect(event: any) {
    for (const file of event.files) {
      if (file.size <= this.maxFilesize) {
        this.uploadedFiles = [
          ...this.uploadedFiles,
          { file, preview: URL.createObjectURL(file) }
        ];
        this.messageService.add({
          key: 'global', severity: 'info', summary: 'Selected', detail: file.name
        });
      }
    }
  }

  onFileRemove(event: any) {
    const removedFile = event.file;
    this.uploadedFiles = this.uploadedFiles.filter(f => f.file !== removedFile);
  }

  onClearFiles() {
    this.uploadedFiles = [];
    this.messageService.add({ key: 'global', severity: 'info', summary: 'Cleared', detail: 'All files removed' });
  }

  saveProduct() {
    this.displayConfirmation = false;

    const metadata = {
      variantName: this.variant.variantName,
      weight: this.variant.weight,
      unit: this.variant.unit,
      sku: this.variant.sku,
      barcode: this.variant.barcode,
      retailPrice: this.variant.retailPrice,
      wholesalePrice: this.variant.wholesalePrice,
      wholesaleEnabled: this.variant.wholesaleEnabled,
      minWholesaleQuantity: this.variant.minWholesaleQuantity,
      wholesaleDiscount: this.variant.wholesaleDiscount,
      availableQuantity: this.variant.availableQuantity,
      lowStockThreshold: this.variant.lowStockThreshold,
      rating: this.variant.rating,
      isFeatured: this.variant.isFeatured,
      variantDescription: this.variant.variantDescription
    };

    const formData = new FormData();
    formData.append('metadata', JSON.stringify(metadata));

    this.uploadedFiles.forEach((item, index) => {
      const extension = item.file.name.split('.').pop();
      const newFileName = index === 0 ? `front.${extension}` : `image-${index}.${extension}`;
      const renamedFile = new File([item.file], newFileName, { type: item.file.type });
      formData.append('file', renamedFile, renamedFile.name);
    });

    this.productService.addVariant(this.productParentId, formData).subscribe({
      next: (res: any) => {
        this.messageService.add({
          key: 'global', severity: 'success', summary: 'Success!',
          sticky: false, detail: res.message || 'Variant added successfully'
        });
        this.route.navigate(['/admin/products/manageproducts']);
      },
      error: (err: any) => {
        this.messageService.add({
          key: 'global', severity: 'error', summary: 'Error',
          sticky: true, detail: err.error?.message || 'Failed to add variant'
        });
      }
    });
  }
}
