import { ProductImage } from "./productImage";
import { SizeInventoryDto } from "./sizeInventoryDto";


export interface ProductVariantResponseDto{
    id: number;
    variantName:string;
    color:string;
    styleCategory:any;
    fit:string;
    pattern:string;
    season:any;
    occation:any;
    isFeatured:any;
    rating:any;
    variantDescription:string;
    productImage:ProductImage[];
    sizes:SizeInventoryDto[];
}