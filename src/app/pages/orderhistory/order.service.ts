// order.service.ts
import { CommonService } from '@/layout/service/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderDetailResponse } from '../orderstatus/orderstatus';


export interface OrderSummaryDto {
  orderNumber: string;
  orderDate: string; 
  totalAmount: number;
  paymentMode: string;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {

     commonService:CommonService = new CommonService;
        private baseUrl = this.commonService.baseUrl;
  constructor(private http: HttpClient) {}

  getOrderHistory(): Observable<OrderSummaryDto[]> {
    // Assuming JWT token stored in localStorage or managed by interceptor
    return this.http.get<OrderSummaryDto[]>(`${this.baseUrl}/orders/history`);
  }
getOrderStatus(orderNumber: string): Observable<OrderDetailResponse> {
  return this.http.get<OrderDetailResponse>(`${this.baseUrl}/orders/details/${orderNumber}`);
}


}
