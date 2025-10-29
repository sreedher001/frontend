import { CommonService } from '@/layout/service/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AdminOrder {
  id:number;
  orderNumber: string;
  username: string;
  totalAmount: number;
  status: any;
  orderDate: any;
  paymentMode:String;
  shippingAddressDto:any;
  items:any
  shippingFee:any;subTotal:any;
  finalTotal:any;
}

export interface ShippingDto {
  orderId: string;
  address: string;
  city: string;
  pincode: string;
  // Add other fields as per your DTO
}

@Injectable({
  providedIn: 'root',
})
export class AdminOrderService {
    commonService:CommonService = new CommonService;
            private baseUrl = this.commonService.baseUrl;

  constructor(private http: HttpClient) {}
getOrdersByDateRange(startDate: string, endDate: string, page: number = 0, size: number = 10): Observable<any> {
  const params = new HttpParams()
    .set('startDate', startDate)
    .set('endDate', endDate)
    .set('page', page.toString())
    .set('size', size.toString());

  return this.http.get(`${this.baseUrl}/admin/orders/all-orders`, { params });
}


  updateOrderStatus(id: number, status: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/orders/${id}/status`, null, {
      params: { value: status }
    });
  }

  rejectOrder(orderNumber: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${orderNumber}/reject`, {});
  }

  shipOrder(dto: ShippingDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/ship`, dto);
  }

  getOrderDetails(orderId: number): Observable<AdminOrder> {
  return this.http.post<AdminOrder>(`${this.baseUrl}/admin/orders/${orderId}/details`, {});
}

}
