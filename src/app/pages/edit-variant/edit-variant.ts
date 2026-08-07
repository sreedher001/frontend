import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FluidModule } from 'primeng/fluid';
import { DialogModule } from 'primeng/dialog';
import { TreeSelectModule } from 'primeng/treeselect';
import { MessageService, TreeNode } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../products/product.service';
import { Addproductservice } from '../admin/addproduct/addproductservice';
import { isAllowedImageFile } from '@/shared/image-validation';
import { CommonService } from '@/layout/service/common';

type Availability = 'retail' | 'wholesale' | 'both';

interface VariantRow {
  id?: number;
  variantName: string;
  weight: string;
  unit: string;
  sku: string;
  barcode: string;
  retailPrice: number;
  mrp: number | null;
  wholesalePrice: number;
  availability: Availability;
  minWholesaleQuantity: number | null;
  wholesaleDiscount: number | null;
  availableQuantity: number;
  lowStockThreshold: number;
  sortOrder: number;
  files: File[];
  previews: string[];
  existingPreviews: { id?: number; url: string }[];
  deletedImageIds: number[];
}

@Component({
  selector: 'app-edit-variant',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ButtonModule, InputTextModule, InputNumberModule,
    SelectModule, CheckboxModule, TextareaModule, TooltipModule,
    FloatLabelModule, FluidModule, DialogModule, TreeSelectModule
  ],
  templateUrl: './edit-variant.html'
})
export class EditVariant implements OnInit {
  loading = true;
  saving = false;
  displayConfirmation = false;
  productId: number | null = null;
  showError = false;
  categories: TreeNode[] = [];
  selectedCategoryKey: any = null;

  unitOptions = [
    { label: 'Grams (g)', value: 'g' },
    { label: 'Kilograms (kg)', value: 'kg' },
    { label: 'Milliliters (ml)', value: 'ml' },
    { label: 'Liters (L)', value: 'L' },
    { label: 'Pieces (pcs)', value: 'pcs' },
    { label: 'Packets', value: 'pkts' },
    { label: 'Boxes', value: 'boxes' }
  ];

  availabilityOptions = [
    { label: 'Retail Only', value: 'retail' },
    { label: 'Wholesale Only', value: 'wholesale' },
    { label: 'Both (Retail & Wholesale)', value: 'both' }
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
    seoDescription: '',
    categoryId: null,
    subCategoryId: null
  };

  variants: VariantRow[] = [];
  private commonService = new CommonService();

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private productService: ProductService,
    private addProductService: Addproductservice,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.route.queryParams.subscribe(params => {
      const pid = params['productId'];
      if (pid) {
        this.productId = +pid;
        this.loadProduct(this.productId);
      } else {
        const vid = params['variantId'];
        if (vid) {
          this.loadByVariantId(+vid);
        } else {
          this.loading = false;
        }
      }
    });
  }

  loadCategories() {
    this.addProductService.getCategoryTree().subscribe({
      next: (res: any) => { this.categories = res; },
      error: () => {}
    });
  }

  loadProduct(productId: number) {
    this.productService.getProductById(productId).subscribe({
      next: (res: any) => {
        this.populateProduct(res);
        this.loading = false;
      },
      error: () => {
        this.messageService.add({ key: 'global', severity: 'error', summary: 'Error', detail: 'Could not load product' });
        this.loading = false;
      }
    });
  }

  loadByVariantId(variantId: number) {
    this.productService.getProductByVariantId(variantId).subscribe({
      next: (res: any) => {
        this.populateProduct(res);
        this.loading = false;
      },
      error: () => {
        this.messageService.add({ key: 'global', severity: 'error', summary: 'Error', detail: 'Could not load product' });
        this.loading = false;
      }
    });
  }

  deriveAvailability(retailEnabled: boolean | undefined, wholesaleEnabled: boolean | undefined): Availability {
    const retail = retailEnabled !== false;
    const wholesale = !!wholesaleEnabled;
    if (retail && wholesale) return 'both';
    if (wholesale) return 'wholesale';
    return 'retail';
  }

  populateProduct(res: any) {
    this.productId = res.id;
    this.product = {
      name: res.name || '',
      shortDescription: res.shortDescription || '',
      longDescription: res.longDescription || '',
      brand: res.brand || '',
      sku: res.sku || '',
      barcode: res.barcode || '',
      tags: res.tags || '',
      isFeatured: res.isFeatured || false,
      seoTitle: res.seoTitle || '',
      seoDescription: res.seoDescription || '',
      categoryId: res.categoryId || null,
      subCategoryId: res.subCategoryId || null
    };

    if (res.categoryId && this.categories.length > 0) {
      this.selectedCategoryKey = { id: res.categoryId, name: res.categoryName || '' };
    }

    this.variants = [];
    if (res.variants) {
      res.variants.forEach((v: any, i: number) => {
        const existingImgs: { id?: number; url: string }[] = [];
        if (v.productImage) {
          v.productImage.forEach((img: any) => {
            existingImgs.push({ id: img.id, url: this.commonService.resolveImageUrl(img.imageUrl) });
          });
        }
        this.variants.push({
          id: v.id,
          variantName: v.variantName || '',
          weight: v.weight || '',
          unit: v.unit || 'g',
          sku: v.sku || '',
          barcode: v.barcode || '',
          retailPrice: v.retailPrice || 0,
          mrp: v.mrp || null,
          wholesalePrice: v.wholesalePrice || 0,
          availability: this.deriveAvailability(v.retailEnabled, v.wholesaleEnabled),
          minWholesaleQuantity: v.minWholesaleQuantity || null,
          wholesaleDiscount: v.wholesaleDiscount || null,
          availableQuantity: v.availableQuantity || 0,
          lowStockThreshold: v.lowStockThreshold || 5,
          sortOrder: v.sortOrder || i,
          files: [],
          previews: [],
          existingPreviews: existingImgs,
          deletedImageIds: []
        });
      });
    }
  }

  addVariant() {
    this.variants.push({
      variantName: '',
      weight: '',
      unit: 'g',
      sku: '',
      barcode: '',
      retailPrice: 0,
      mrp: null,
      wholesalePrice: 0,
      availability: 'retail',
      minWholesaleQuantity: null,
      wholesaleDiscount: null,
      availableQuantity: 0,
      lowStockThreshold: 5,
      sortOrder: this.variants.length,
      files: [],
      previews: [],
      existingPreviews: [],
      deletedImageIds: []
    });
  }

  removeVariant(index: number) {
    if (this.variants.length <= 1) {
      this.messageService.add({ key: 'global', severity: 'warn', summary: 'Cannot Remove', detail: 'At least one variant is required' });
      return;
    }
    const v = this.variants[index];
    v.previews.forEach(p => URL.revokeObjectURL(p));
    this.variants.splice(index, 1);
  }

  onVariantFileSelect(event: any, index: number) {
    for (const file of event.files) {
      if (!isAllowedImageFile(file)) {
        this.messageService.add({
          key: 'global',
          severity: 'warn',
          summary: 'Unsupported file',
          detail: `"${file.name}" isn't a JPG, PNG, or WEBP image`
        });
        continue;
      }
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

  removeExistingImage(variantIndex: number, imgIndex: number) {
    const img = this.variants[variantIndex].existingPreviews[imgIndex];
    if (img.id) {
      this.variants[variantIndex].deletedImageIds.push(img.id);
    }
    this.variants[variantIndex].existingPreviews.splice(imgIndex, 1);
  }

  get totalExistingImages(): number {
    return this.variants.reduce((sum, v) => sum + v.existingPreviews.length, 0);
  }

  get totalNewImages(): number {
    return this.variants.reduce((sum, v) => sum + v.files.length, 0);
  }

  hasImages(i: number): boolean {
    return this.variants[i].existingPreviews.length > 0 || this.variants[i].files.length > 0;
  }

  openConfirmation() {
    this.showError = false;
    if (!this.selectedCategoryKey) {
      this.showError = true;
      this.messageService.add({ key: 'global', severity: 'error', summary: 'Validation Error', detail: 'Please select a category' });
      return;
    }
    this.displayConfirmation = true;
  }

  saveProduct() {
    this.displayConfirmation = false;
    this.saving = true;

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
        id: v.id || null,
        deletedImageIds: v.deletedImageIds,
        variantName: v.variantName,
        weight: v.weight,
        unit: v.unit,
        sku: v.sku,
        barcode: v.barcode,
        retailPrice: v.retailPrice,
        mrp: v.mrp,
        wholesalePrice: v.wholesalePrice,
        retailEnabled: v.availability === 'retail' || v.availability === 'both',
        wholesaleEnabled: v.availability === 'wholesale' || v.availability === 'both',
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

    const url = this.productId
      ? `${this.productService['apiUrl']}/admin/products/${this.productId}/update-with-variants`
      : `${this.productService['apiUrl']}/admin/products/create-with-variants`;

    const call = this.productId
      ? this.productService.updateProductWithVariants(this.productId, formData)
      : this.productService.createProductWithVariants(formData);

    call.subscribe({
      next: (res: any) => {
        this.saving = false;
        this.messageService.add({ key: 'global', severity: 'success', summary: 'Saved!', detail: res.message || 'Product updated successfully' });
        this.router.navigate(['/admin/products/manageproducts']);
      },
      error: (err: any) => {
        this.saving = false;
        this.messageService.add({ key: 'global', severity: 'error', summary: 'Error', detail: err.error?.message || 'Update failed' });
      }
    });
  }
}
