import { ProductImage } from "./productImage";
import { SizeInventoryDto } from "./sizeInventoryDto";


export interface ProductVariantResponseDto{
    id: number;
    color:string;
    productImage:ProductImage[];
    sizes:SizeInventoryDto[];
}