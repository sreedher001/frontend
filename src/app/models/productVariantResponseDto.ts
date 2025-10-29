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
    occasion:any;
    isFeatured:any;
    rating:number;
    variantDescription:string;
    productImage:ProductImage[];
    sizes:SizeInventoryDto[];

    fabricType: string;
    materialComposition: string;
    liningMaterial: string;
    transparencyLevel: string;
    stretchability: string;
    workType: string;
    careInstructions: string;
    madeBy: string;
    sizeRecommendation: string;
    modelInfo: string;
}