import { CommonService } from '@/layout/service/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShippingDto } from './shiporder';

@Injectable({
  providedIn: 'root',
})
export class ShipOrderService {
  
    commonService:CommonService = new CommonService;
            private baseUrl = this.commonService.baseUrl;

  constructor(private http: HttpClient) {}

  loadPickupLocations(): Observable<{ pickupLocationList: string[] }> {
    return this.http.get<{ pickupLocationList: string[] }>(
      `${this.baseUrl}/shiprocket/pickup-addresses`
    );
  }

  createShipping(shippingDto: ShippingDto): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/admin/orders/ship`, shippingDto);
  }
}