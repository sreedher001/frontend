import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CommonService } from '@/layout/service/common';
import { CartResponse } from './cart.model';
import { PurchaseType } from './cart.model';

export type { PurchaseType };

export interface AddToCartPayload {
    variantId: number;
    quantity: number;
    purchaseType: PurchaseType;
}

@Injectable({ providedIn: 'root' })
export class CartService {

    commonService: CommonService = new CommonService();
    private baseUrl = this.commonService.baseUrl;

    private cartCountSubject = new BehaviorSubject<number>(0);
    cartCount$ = this.cartCountSubject.asObservable();

    private cartRefreshSubject = new BehaviorSubject<boolean>(false);
    cartRefresh$ = this.cartRefreshSubject.asObservable();

    private drawerVisibleSubject = new BehaviorSubject<boolean>(false);
    drawerVisible$ = this.drawerVisibleSubject.asObservable();

    private cartSubject = new BehaviorSubject<CartResponse | null>(null);
    cart$ = this.cartSubject.asObservable();

    private purchaseTypeSubject = new BehaviorSubject<PurchaseType>(
        (localStorage.getItem('purchaseType') as PurchaseType) || 'RETAIL'
    );
    purchaseType$ = this.purchaseTypeSubject.asObservable();

    openDrawer() {
        this.drawerVisibleSubject.next(true);
    }

    closeDrawer() {
        this.drawerVisibleSubject.next(false);
    }

    constructor(private http: HttpClient) { }

    getPurchaseType(): PurchaseType {
        return this.purchaseTypeSubject.value;
    }

    setPurchaseType(type: PurchaseType) {
        localStorage.setItem('purchaseType', type);
        this.purchaseTypeSubject.next(type);
    }

    switchPurchaseType(type: PurchaseType): Observable<CartResponse> {
        return this.http.post<CartResponse>(`${this.baseUrl}/cart/switch-mode`, null, { params: { type } }).pipe(
            tap((cart) => {
                this.setPurchaseType(type);
                this.cartSubject.next(cart);
                const count = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
                this.cartCountSubject.next(count);
            })
        );
    }

    addToCart(payload: AddToCartPayload): Observable<any> {
        return this.http.post(`${this.baseUrl}/cart/add`, payload).pipe(
            tap(() => {
                this.getCart().subscribe();
                this.openDrawer();
            })
        );
    }

    getCart(): Observable<CartResponse> {
        return this.http.get<CartResponse>(`${this.baseUrl}/cart/get-cart`).pipe(
            tap((cart) => {
                this.cartSubject.next(cart);
                const count = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
                this.cartCountSubject.next(count);
            })
        );
    }

    removeItem(productId: number): Observable<CartResponse> {
        const params = new HttpParams().set('productId', productId);
        return this.http.post<CartResponse>(`${this.baseUrl}/cart/remove`, null, { params }).pipe(
            tap(() => this.getCart().subscribe())
        );
    }

    updateCartItem(productId: number, quantity: number, size: string, sizeId: number) {
        const params = new HttpParams()
            .set('productId', productId)
            .set('quantity', quantity)
            .set('size', size)
            .set('sizeId', sizeId);

        return this.http.post<CartResponse>(`${this.baseUrl}/cart/update`, null, { params }).pipe(
            tap(cart => this.cartSubject.next(cart))
        );
    }

    applyCoupon(code: string) {
        return this.http.post<CartResponse>(`${this.baseUrl}/cart/apply-coupon`, { couponCode: code });
    }

    removeCoupon() {
        return this.http.post<CartResponse>(`${this.baseUrl}/cart/remove-coupon`, {});
    }

    refreshCartCount() {
        this.getCart().subscribe({
            next: (cart) => {
                const count = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
                this.cartCountSubject.next(count);
            },
            error: () => this.cartCountSubject.next(0)
        });
    }

    mergeCart() {
        return this.http.post(`${this.baseUrl}/cart/merge`, null);
    }
}
