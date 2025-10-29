import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonService } from '@/layout/service/common';

export interface ShippingAddress {
  id: number;
  name:string;
  country: string;
  state: string;
  pinCode: string;
  address: string;
  city: string;
  phoneNumber: string;
  isDefault: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

    commonService:CommonService = new CommonService;
    private baseUrl = this.commonService.baseUrl;

    constructor(private http: HttpClient) {
}


  //  Get all addresses for user
  getAllShippingAddresses(userId: number): Observable<ShippingAddress[]> {
    return this.http.get<ShippingAddress[]>(`${this.baseUrl}/users/${userId}/addresses/get-all-shipping-address`);
  }

  // Get a specific address
  getShippingAddressById(userId: number, addressId: number): Observable<ShippingAddress> {
    return this.http.get<ShippingAddress>(`${this.baseUrl}/users/${userId}/addresses/shipping-address/${addressId}`);
  }

  //  Create new address
  createShippingAddress(userId: number, address: ShippingAddress): Observable<ShippingAddress> {
    return this.http.post<ShippingAddress>(`${this.baseUrl}/users/${userId}/addresses/create`, address);
  }

  //  Update existing address
  updateShippingAddress(userId: number, addressId: number, address: ShippingAddress): Observable<ShippingAddress> {
    return this.http.post<ShippingAddress>(`${this.baseUrl}/users/${userId}/addresses/update-shipping-address/${addressId}`, address);
  }

  //  Delete address
  deleteShippingAddress(userId: number, addressId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${userId}/addresses/remove-shipping-address/${addressId}`);
  }

  //checkout
  Checkout(checkoutRequest:any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/orders/checkout`,checkoutRequest);
  }


  
createRazorpayOrder(orderNumber: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/payments/create-order`, { orderNumber });
}

verifyRazorpayPayment(data: any): Observable<any> {
  
  return this.http.post(`${this.baseUrl}/payments/verify`, data);
}
}
