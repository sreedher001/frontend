export interface CartItemDto {
  id: number;
  variantId:number;
  variantName: string;
  size:any;
  sizeId:number;
  color:string;
  price: number;
  originalPrice:number;
  discount:number;
  quantity: number;
  imageUrl:String;
  total: number;
  availableSizes:any[];
  availableQuantity:number;
  sizeOptions: any[];       
  selectedSizeObj:any;    // All sizes for autocomplete
  filteredSizeOptions: any[];   // Filtered for search
}

export interface CartResponse {
  cartId: number;
  items: CartItemDto[];
}
