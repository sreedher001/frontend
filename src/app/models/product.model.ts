import { ProductVariantResponseDto } from "./productVariantResponseDto";


export interface Product {
  id: number;
  productId: string;
  name: string;
  description: any;
  genderCategory:string;
  category:string;
  rating: number;
  isFeatured:boolean;
  uploadedAt: any;
  variants: ProductVariantResponseDto[];
  variant:ProductVariantResponseDto;

  
}
