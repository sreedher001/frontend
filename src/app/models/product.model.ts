import { ProductVariantResponseDto } from "./productVariantResponseDto";
import { ProductImage } from "./productImage";

export interface Product {
  id: number;
  productId: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  categoryId: number;
  categoryName: string;
  subCategoryId: number;
  subCategoryName: string;
  brand: string;
  sku: string;
  barcode: string;
  active: boolean;
  isFeatured: boolean;
  thumbnail: string;
  seoTitle: string;
  seoDescription: string;
  tags: string;
  sortOrder: number;
  rating: number;
  uploadedAt: any;
  variants: ProductVariantResponseDto[];
  variant: ProductVariantResponseDto;
  productImages: ProductImage[];
}
