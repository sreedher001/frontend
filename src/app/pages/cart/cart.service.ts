import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonService } from '@/layout/service/common';
import { CartResponse } from './cart.model';

export interface AddToCartPayload {
    variantId: number;
    sizeId: number;
    color: string;
    quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
   
    commonService: CommonService = new CommonService;
    private baseUrl = this.commonService.baseUrl;

    constructor(private http: HttpClient) { }

    addToCart(payload: AddToCartPayload): Observable<any> {

        return this.http.post(`${this.baseUrl}/cart/add`, payload);
    }

    getCart(): Observable<CartResponse> {
        return this.http.get<CartResponse>(`${this.baseUrl}/cart/get-cart`);
    }

    removeItem(productId: number): Observable<any> {
         const params = new HttpParams()
      .set('productId', productId);
        return this.http.post(`${this.baseUrl}/cart/remove`, null, {
  params
});
    }

    updateCartItem(productId: number, quantity: number, size: string) {


    const params = new HttpParams()
      .set('productId', productId)
      .set('quantity', quantity)
      .set('size', size);

    return this.http.post(`${this.baseUrl}/cart/update`, null, {params });
  }
}