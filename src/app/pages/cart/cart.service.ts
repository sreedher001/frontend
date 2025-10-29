import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
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

    private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

    constructor(private http: HttpClient) { }

    addToCart(payload: AddToCartPayload): Observable<any> {

        return this.http.post(`${this.baseUrl}/cart/add`, payload).pipe(
      tap(() => {
        
        this.refreshCartCount();
      })
    );
    }

    // getCart(): Observable<CartResponse> {
    //     return this.http.get<CartResponse>(`${this.baseUrl}/cart/get-cart`);
    // }
    getCart(): Observable<CartResponse> {
  return this.http.get<CartResponse>(`${this.baseUrl}/cart/get-cart`).pipe(
    tap((res) => {
      //update BehaviorSubject with new count
      this.cartCountSubject.next(res?.items?.length || 0);
    })
  );
}


   removeItem(productId: number): Observable<any> {
  const params = new HttpParams().set('productId', productId);

  return this.http.post(`${this.baseUrl}/cart/remove`, null, { params }).pipe(
    tap(() => this.refreshCartCount()) // immediately refresh after removal
  );
}


    updateCartItem(productId: number, quantity: number, size: string) {


    const params = new HttpParams()
      .set('productId', productId)
      .set('quantity', quantity)
      .set('size', size);

    return this.http.post(`${this.baseUrl}/cart/update`, null, {params });
  }

//   refreshCartCount() {
//   this.getCart().subscribe({
//     error: () => this.cartCountSubject.next(0)
//   });
// }
refreshCartCount() {
  this.getCart().subscribe({
    next: (cart) => {
      const count = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
      this.cartCountSubject.next(count);
    },
    error: () => this.cartCountSubject.next(0)
  });
}

}