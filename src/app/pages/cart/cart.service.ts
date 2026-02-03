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

  private cartRefreshSubject = new BehaviorSubject<boolean>(false);
cartRefresh$ = this.cartRefreshSubject.asObservable();
  private drawerVisibleSubject = new BehaviorSubject<boolean>(false);
  drawerVisible$ = this.drawerVisibleSubject.asObservable();

  private cartSubject = new BehaviorSubject<CartResponse | null>(null);
cart$ = this.cartSubject.asObservable();

private guestCartKey = 'guestCart';
private getGuestCart(): any[] {
  try {
    return JSON.parse(localStorage.getItem(this.guestCartKey) || '[]');
  } catch {
    return [];
  }
}

private setGuestCart(cart: any[]) {
  localStorage.setItem(this.guestCartKey, JSON.stringify(cart));
}
refreshCartStateForGuest() {
  const guestCart = this.getGuestCart();

  const count = guestCart.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  this.cartCountSubject.next(count);     
  this.cartRefreshSubject.next(true);    
}
  openDrawer() {
    this.drawerVisibleSubject.next(true);
    if(localStorage.getItem("isLoggedIn")==="true"){
      this.getCart().subscribe(); 
    }
  }

  closeDrawer() {
    this.drawerVisibleSubject.next(false);
  }

    constructor(private http: HttpClient) { }

    addToCart(payload: AddToCartPayload): Observable<any> {

      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (!isLoggedIn) {
    //  GUEST FLOW
    const guestCart = this.getGuestCart();

    const existing = guestCart.find(
      i => i.variantId === payload.variantId && i.sizeId === payload.sizeId
    );

    if (existing) {
      existing.quantity += payload.quantity;
    } else {
      guestCart.push(payload);
    }

    this.setGuestCart(guestCart);

    
    this.refreshCartStateForGuest();
    this.openDrawer();
     return new BehaviorSubject({ success: true }).asObservable();
  }

        return this.http.post(`${this.baseUrl}/cart/add`, payload).pipe(
      tap(() => {
        this.getCart().subscribe();
        this.openDrawer();
        this.refreshCartCount();
      })
    );
    }

    // getCart(): Observable<CartResponse> {
    //     return this.http.get<CartResponse>(`${this.baseUrl}/cart/get-cart`);
    // }
//     getCart(): Observable<CartResponse> {
//   return this.http.get<CartResponse>(`${this.baseUrl}/cart/get-cart`).pipe(
//     tap((res) => {
//       //update BehaviorSubject with new count
//       this.cartCountSubject.next(res?.items?.length || 0);
//     })
//   );
// }

getCart(): Observable<CartResponse> {
  return this.http.get<CartResponse>(`${this.baseUrl}/cart/get-cart`).pipe(
    tap((cart) => {
      this.cartSubject.next(cart);

      const count =
        cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

      this.cartCountSubject.next(count);
    })
  );
}


//    removeItem(productId: number): Observable<any> {
//   const params = new HttpParams().set('productId', productId);

//   return this.http.post(`${this.baseUrl}/cart/remove`, null, { params }).pipe(
//     tap(() => this.refreshCartCount()) // immediately refresh after removal
//   );
// }


//     updateCartItem(productId: number, quantity: number, size: string,sizeId:number) {


//     const params = new HttpParams()
//       .set('productId', productId)
//       .set('quantity', quantity)
//       .set('size', size)
//       .set('sizeId', sizeId);

//     return this.http.post(`${this.baseUrl}/cart/update`, null, {params });
//   }


removeItem(productId: number): Observable<CartResponse> {
  const params = new HttpParams().set('productId', productId);

  return this.http.post<CartResponse>(
    `${this.baseUrl}/cart/remove`,
    null,
    { params }
  ).pipe(
    tap(()=>{
      this.getCart().subscribe()
      //cart => this.cartSubject.next(cart)
})
   
  );
}

updateCartItem(productId: number, quantity: number, size: string, sizeId: number) {
  const params = new HttpParams()
    .set('productId', productId)
    .set('quantity', quantity)
    .set('size', size)
    .set('sizeId', sizeId);

  return this.http.post<CartResponse>(
    `${this.baseUrl}/cart/update`,
    null,
    { params }
  ).pipe(
    tap(cart => this.cartSubject.next(cart))
  );
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