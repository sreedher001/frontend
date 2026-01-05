export interface ReviewRequest {
  orderId: number;
  variantId: number;
  rating: number;
  reviewText?: string;
}
