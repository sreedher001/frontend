import { Product } from './product.model';

export interface ProductResponse {
  content: Product[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  product:Product;
  numberOfElements:number;
  first:any;
  last:any;
}
