import { ProductImage } from "./productImage";

export interface ProductVariantResponseDto {
    id: number;
    variantName: string;
    weight: string;
    unit: string;
    sku: string;
    barcode: string;
    retailPrice: number;
    wholesalePrice: number;
    wholesaleEnabled: boolean;
    minWholesaleQuantity: number;
    wholesaleDiscount: number;
    active: boolean;
    sortOrder: number;
    imageUrl: string;
    isFeatured: boolean;
    rating: number;
    totalReviews: number;
    productImage: ProductImage[];
    availableQuantity: number;
    inventoryStatus: string;
}
