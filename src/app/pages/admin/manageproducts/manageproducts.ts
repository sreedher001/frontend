import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { Confirmation, ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Product } from '@/models/product.model';
import { ProductService } from '@/pages/products/product.service';
import { Router } from '@angular/router';
import { ProductVariantResponseDto } from '@/models/productVariantResponseDto';
import { ProductImage } from '@/models/productImage';
import { ProductResponse } from '@/models/product-response.model';


interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}
@Component({
  selector: 'app-manageproducts',
  imports: [CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule],
  templateUrl: './manageproducts.html',
  styleUrl: './manageproducts.scss'
})
export class Manageproducts {

  productDialog: boolean = false;

  products = signal<Product[]>([]);

  product!: Product;

  productResponse: ProductResponse | undefined;

  selectedProducts!: Product[] | null;

  submitted: boolean = false;

  statuses!: any[];

  flattenedProducts: any[] = [];

  @ViewChild('dt') dt!: Table;

  exportColumns!: ExportColumn[];

  cols!: Column[];

  constructor(
    private productService: ProductService,
    private messageService: MessageService, private router: Router, private confirmationService: ConfirmationService
  ) { }

  exportCSV() {
    this.dt.exportCSV();
  }

  ngOnInit() {
    this.loadDemoData();
    
  }

  loadDemoData() {
    // this.productService.getAllProducts().then((data) => {
    //     this.products.set(data);
    // });

    this.productService.getAllProducts(0, 10).subscribe({
      next: (res) => {
        this.productResponse = res;
        this.products.set(this.productResponse.content);
        console.log("res.content", res.content)
        console.log("this.product", this.productResponse.content)
        // this.messageService.add({
        //   key: 'global',
        //   severity: 'success',
        //   summary: 'TADA!',
        //   detail: 'Enjoy shopping with ZFC!'
        // });

        this.statuses = [
          { label: 'INSTOCK', value: 'instock' },
          { label: 'LOWSTOCK', value: 'lowstock' },
          { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.cols = [
          { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
          { field: 'name', header: 'Name' },
          { field: 'image', header: 'Image' },
          { field: 'price', header: 'Price' },
          { field: 'category', header: 'Category' },
          { field: 'subcategory', header: 'Sub Category' }
        ];
this.flattenProducts();
        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
      },
      error: (err) => {
        console.error('Failed to fetch products:', err);
        this.messageService.add({
          key: 'global',
          severity: 'error',
          summary: 'Oops!',
          detail: 'Failed to fetch the products'
        });
      }
    });


  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.router.navigate(['/admin/products/add']);
  }

  flattenProducts() {
  this.flattenedProducts = this.products().flatMap(product =>
    product.variants.map(variant => ({
      productId: product.productId,
      variantId: variant.id,
      code: variant.id, // or variant.sku if available
      name: product.name,
      category: product.category,
      rating: product.rating,
      image: this.getFrontImage(variant),
      color: variant.color,
      // you can keep aggregated info if needed
      totalSizes: variant.sizes.length,
      minPrice: Math.min(...variant.sizes.map(s => s.price)),
      maxPrice: Math.max(...variant.sizes.map(s => s.price)),
      status: variant.sizes.some(s => s.availableQuantity > 0) ? 'INSTOCK' : 'OUTOFSTOCK'
    }))
  );
  console.log("this.flattenedProducts", this.flattenedProducts);
}

getFrontImage(variant: ProductVariantResponseDto) {
  if (variant.productImage && variant.productImage.length > 0) {
    const frontImg = variant.productImage.find(
      x => x.viewType === 'front' || x.viewType === 'FRONT'
    );
    return frontImg ? frontImg.imageUrl : variant.color;
  }
  return variant.color;
  
}

  editProduct(product: any) {
    console.log("edit click", product)
    this.router.navigate(
      ['/admin/products/edit'],
      {
        queryParams: { variantId: product.variantId, mode: 'edit' }
      }
    );
   // this.product = { ...product };
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products.set(this.products().filter((val) => !this.selectedProducts?.includes(val)));
        this.selectedProducts = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Products Deleted',
          life: 3000
        });
      }
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products.set(this.products().filter((val) => val.id !== product.id));
        //this.product = {};
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Deleted',
          life: 3000
        });
      }
    });
  }

  // findIndexById(id: string): number {
  //   let index = -1;
  //   for (let i = 0; i < this.products().length; i++) {
  //     if (this.products()[i].id === id) {
  //       index = i;
  //       break;
  //     }
  //   }

  //   return index;
  // }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'info';
    }
  }
}
