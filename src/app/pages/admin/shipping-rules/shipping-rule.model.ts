export interface ShippingRule {
  id?: number;
  name: string;
  minCartValue: number;
  maxCartValue?: number;
  shippingFee: number;
  freeShipping: boolean;
  priority: number;
  active: boolean;
}