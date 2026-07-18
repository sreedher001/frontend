export type PurchaseType = 'RETAIL' | 'WHOLESALE';

export interface CartItemDto {
  id: number;
  variantId: number;
  variantName: string;
  weight?: string;
  unit?: string;
  price: number;
  originalPrice?: number;
  wholesalePrice?: number;
  discount?: number;
  quantity: number;
  imageUrl?: string;
  total: number;
  availableQuantity?: number;
  availableSizes?: any[];
  sizeOptions?: any[];
  selectedSizeObj?: any;
  filteredSizeOptions?: any[];
  purchaseType?: PurchaseType;
}

export interface CartResponse {
  cartId: number;
  userId?: number;
  shippingFee: number;
  subtotal?: number;
  totalAmount: number;
  discount?: number;
  cgst?: number;
  sgst?: number;
  items: CartItemDto[];
  appliedPromotions: any[];
  availableCoupons: any[];
  lockedCoupons: any[];
  purchaseType: PurchaseType;
}
