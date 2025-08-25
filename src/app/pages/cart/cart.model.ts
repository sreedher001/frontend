export interface CartItemDto {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl:String;
  total: number;
}

export interface CartResponse {
  cartId: number;
  items: CartItemDto[];
}
