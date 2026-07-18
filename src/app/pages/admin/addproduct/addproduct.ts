import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FluidModule } from 'primeng/fluid';
import { TreeSelectModule } from 'primeng/treeselect';
import { MessageService, TreeNode } from 'primeng/api';
import { Router } from '@angular/router';
import { ProductService } from '@/pages/products/product.service';
import { Addproductservice } from './addproductservice';

interface VariantRow {
  id?: number;
  variantName: string;
  weight: string;
  unit: string;
  sku: string;
  barcode: string;
  retailPrice: number;
  wholesalePrice: number;
  wholesaleEnabled: boolean;
  minWholesaleQuantity: number | null;
  wholesaleDiscount: number | null;
  availableQuantity: number;
  lowStockThreshold: number;
  sortOrder: number;
  files: File[];
  previews: string[];
}

@Component({
  selector: 'app-addproduct',
  imports: [
    CommonModule, FormsModule, InputTextModule, ButtonModule, TextareaModule,
    InputNumberModule, SelectModule, CheckboxModule, TooltipModule, DialogModule,
    FloatLabelModule, FluidModule, TreeSelectModule
  ],
  templateUrl: './addproduct.html',
  styleUrl: './addproduct.scss'
})
export class Addproduct implements OnInit {
  loading = false;
  displayConfirmation = false;
  categories: TreeNode[] = [];
  selectedCategoryKey: any = null;
  showError = false;

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
    name: '',
    shortDescription: '',
    longDescription: '',
    brand: '',
    sku: '',
    barcode: '',
    tags: '',
    isFeatured: false,
    seoTitle: '',
    seoDescription: ''
  };

  variants: VariantRow[] = [];

  constructor(
    private productService: ProductService,
    private addProductService: Addproductservice,
    private messageService: MessageService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.addVariant();
  }

  loadCategories() {
    this.addProductService.getCategoryTree().subscribe({
      next: (res: any) => { this.categories = res; },
      error: (err: any) => {
        this.messageService.add({
          key: 'global', severity: 'error', summary: 'Error',
          detail: err.error?.message || 'Unable to load categories'
        });
      }
    });
  }

  addVariant() {
    this.variants.push({
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
      sortOrder: this.variants.length,
      files: [],
      previews: []
    });
  }

  removeVariant(index: number) {
    if (this.variants.length <= 1) {
      this.messageService.add({
        key: 'global', severity: 'warn', summary: 'Cannot Remove',
        detail: 'At least one variant is required'
      });
      return;
    }
    const v = this.variants[index];
    v.previews.forEach(p => URL.revokeObjectURL(p));
    this.variants.splice(index, 1);
  }

  duplicateVariant(index: number) {
    const src = this.variants[index];
    const copy: VariantRow = {
      variantName: src.variantName + ' (copy)',
      weight: src.weight,
      unit: src.unit,
      sku: '',
      barcode: '',
      retailPrice: src.retailPrice,
      wholesalePrice: src.wholesalePrice,
      wholesaleEnabled: src.wholesaleEnabled,
      minWholesaleQuantity: src.minWholesaleQuantity,
      wholesaleDiscount: src.wholesaleDiscount,
      availableQuantity: src.availableQuantity,
      lowStockThreshold: src.lowStockThreshold,
      sortOrder: this.variants.length,
      files: [],
      previews: []
    };
    this.variants.push(copy);
  }

  onVariantFileSelect(event: any, index: number) {
    for (const file of event.files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.variants[index].files.push(file);
        this.variants[index].previews.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  removeVariantFile(variantIndex: number, fileIndex: number) {
    URL.revokeObjectURL(this.variants[variantIndex].previews[fileIndex]);
    this.variants[variantIndex].files.splice(fileIndex, 1);
    this.variants[variantIndex].previews.splice(fileIndex, 1);
  }

  onSubmit(form: NgForm) {
    this.showError = false;
    const hasImages = this.variants.every(v => v.files.length > 0);
    if (form.invalid || !this.selectedCategoryKey || !hasImages) {
      this.showError = true;
      this.messageService.add({
        key: 'global', severity: 'error', summary: 'Validation Error',
        detail: 'Please fill all required fields, select a category, and upload at least one image per variant.'
      });
      return;
    }
    this.displayConfirmation = true;
  }

  saveProduct() {
    this.displayConfirmation = false;
    this.loading = true;

    const categoryId = this.selectedCategoryKey?.id || this.selectedCategoryKey;

    const metadata: any = {
      name: this.product.name,
      shortDescription: this.product.shortDescription,
      longDescription: this.product.longDescription,
      brand: this.product.brand,
      sku: this.product.sku,
      barcode: this.product.barcode,
      tags: this.product.tags,
      isFeatured: this.product.isFeatured,
      seoTitle: this.product.seoTitle,
      seoDescription: this.product.seoDescription,
      categoryId: categoryId,
      variants: this.variants.map((v, i) => ({
        variantName: v.variantName,
        weight: v.weight,
        unit: v.unit,
        sku: v.sku,
        barcode: v.barcode,
        retailPrice: v.retailPrice,
        wholesalePrice: v.wholesalePrice,
        wholesaleEnabled: v.wholesaleEnabled,
        minWholesaleQuantity: v.minWholesaleQuantity,
        wholesaleDiscount: v.wholesaleDiscount,
        availableQuantity: v.availableQuantity,
        lowStockThreshold: v.lowStockThreshold,
        sortOrder: i
      }))
    };

    const formData = new FormData();
    formData.append('metadata', JSON.stringify(metadata));

    this.variants.forEach((v, vi) => {
      v.files.forEach((file, fi) => {
        const ext = file.name.split('.').pop();
        const fileName = `variant_${vi}_${fi === 0 ? 'front' : 'image-' + fi}.${ext}`;
        formData.append('files', file, fileName);
      });
    });

    this.productService.createProductWithVariants(formData).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.messageService.add({
          key: 'global', severity: 'success', summary: 'Success!',
          detail: res.message || 'Product created successfully'
        });
        this.router.navigate(['/admin/products/manageproducts']);
      },
      error: (err: any) => {
        this.loading = false;
        this.messageService.add({
          key: 'global', severity: 'error', summary: 'Error',
          detail: err.error?.message || 'Failed to create product'
        });
      }
    });
  }
}
