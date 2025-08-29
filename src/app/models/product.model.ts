import { ProductVariantResponseDto } from "./productVariantResponseDto";
import { sizeDto } from "./size";


export interface Product {
  id: number;
  productId: string;
  name: string;
  description: any;
  genderCategory:string;
  category:string;
  subCategory:string;
  color:string;
  rating: number;
  isFeatured:boolean;
  uploadedAt: any;
  variants: ProductVariantResponseDto[];
  variant:ProductVariantResponseDto;
  sizes:sizeDto[];

  
}
