export interface CartItemDto {
  id: number;
  variantId:number;
  variantName: string;
  size:any;
  color:string;
  price: number;
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
