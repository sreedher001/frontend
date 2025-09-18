export interface CartItemDto {
  productId: number;
  variantId:number;
  variantName: string;
  size:string;
  color:string;
  price: number;
  quantity: number;
  imageUrl:String;
  total: number;
  availableSizes:any[];

  sizeOptions: any[];           // All sizes for autocomplete
  filteredSizeOptions: any[];   // Filtered for search
}

export interface CartResponse {
  cartId: number;
  items: CartItemDto[];
}
