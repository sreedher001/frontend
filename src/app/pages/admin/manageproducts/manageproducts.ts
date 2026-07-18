import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { Product } from '@/models/product.model';
import { ProductService } from '@/pages/products/product.service';
import { Router } from '@angular/router';
import { ProductVariantResponseDto } from '@/models/productVariantResponseDto';

@Component({
  selector: 'app-manageproducts',
  imports: [
    CommonModule, TableModule, FormsModule, ButtonModule, RippleModule,
    ToastModule, ToolbarModule, InputTextModule, DialogModule, TagModule,
    InputIconModule, IconFieldModule, ConfirmDialogModule, FileUploadModule
  ],
  templateUrl: './manageproducts.html',
  styleUrl: './manageproducts.scss'
})
export class Manageproducts implements OnInit {
  products = signal<Product[]>([]);
  flattenedProducts: any[] = [];
  selectedProducts!: Product[] | null;
  loading = false;
  totalRecords = 0;
  page = 0;
  size = 20;
  hasMore = true;

  displayExcelImport = false;
  excelFile: File | null = null;
  importResult: any = null;
  importing = false;

  @ViewChild('dt') dt!: Table;

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    if (this.loading || !this.hasMore) return;
    this.loading = true;
    this.productService.getAllProducts(this.page, this.size).subscribe({
      next: (res) => {
        const existing = this.products();
        const newProducts = res.content || [];
        this.products.set([...existing, ...newProducts]);
        this.hasMore = !res.last;
        this.page++;
        this.totalRecords = res.totalElements || 0;
        this.flattenProducts();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          key: 'global', severity: 'error', summary: 'Error', detail: 'Failed to fetch products'
        });
      }
    });
  }

  flattenProducts() {
    this.flattenedProducts = this.products().flatMap(product =>
      (product.variants || []).map(variant => ({
        productId: product.productId,
        productNumericId: product.id,
        variantId: variant.id,
        name: product.name,
        category: product.categoryId,
        rating: variant.rating,
        image: this.getFrontImage(variant),
        weight: variant.weight,
        unit: variant.unit,
        retailPrice: variant.retailPrice,
        wholesalePrice: variant.wholesalePrice,
        sku: variant.sku,
        status: variant.availableQuantity > 0 ? 'INSTOCK' : 'OUTOFSTOCK'
      }))
    );
  }

  getFrontImage(variant: ProductVariantResponseDto) {
    if (variant.productImage && variant.productImage.length > 0) {
      const frontImg = variant.productImage.find(x => x.viewType === 'front' || x.viewType === 'FRONT');
      return frontImg ? frontImg.imageUrl : variant.imageUrl;
    }
    return variant.imageUrl;
  }

  openNew() {
    this.router.navigate(['/admin/products/add']);
  }

  editProduct(product: any) {
    this.router.navigate(['/admin/products/edit'], {
      queryParams: { productId: product.productNumericId, mode: 'edit' }
    });
  }

  deleteProduct(product: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService.deleteProduct(product.productNumericId).subscribe({
          next: () => {
            this.products.set(this.products().filter(p => p.id !== product.productNumericId));
            this.flattenProducts();
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Product deleted', life: 3000 });
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete' });
          }
        });
      }
    });
  }

  // Excel Import
  openExcelImport() {
    this.excelFile = null;
    this.importResult = null;
    this.displayExcelImport = true;
  }

  onExcelFileSelect(event: any) {
    if (event.files && event.files.length > 0) {
      this.excelFile = event.files[0];
    }
  }

  importExcel() {
    if (!this.excelFile) {
      this.messageService.add({ key: 'global', severity: 'warn', summary: 'No File', detail: 'Please select an Excel file' });
      return;
    }
    this.importing = true;
    const formData = new FormData();
    formData.append('file', this.excelFile);
    this.productService.importExcel(formData).subscribe({
      next: (res: any) => {
        this.importing = false;
        this.importResult = res;
        if (res.success) {
          this.messageService.add({ key: 'global', severity: 'success', summary: 'Import Complete', detail: res.message });
          this.products.set([]);
          this.page = 0;
          this.hasMore = true;
          this.loadProducts();
        }
      },
      error: (err: any) => {
        this.importing = false;
        this.importResult = err.error;
        this.messageService.add({ key: 'global', severity: 'error', summary: 'Import Failed', detail: err.error?.message || 'Import failed' });
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK': return 'success';
      case 'LOWSTOCK': return 'warn';
      case 'OUTOFSTOCK': return 'danger';
      default: return 'info';
    }
  }
}
