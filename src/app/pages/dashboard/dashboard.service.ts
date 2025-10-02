import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductResponse } from '@/models/product-response.model';
import { Product } from '@/models/product.model';
import { CommonService } from '@/layout/service/common';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  commonService:CommonService = new CommonService;
      private apiUrl = this.commonService.baseUrl;

  constructor(private http: HttpClient) {}


  getSalesTrend(view: string): Observable<{
  labels: string[],
  values: number[],
  growth: number,
  bestPeriod: string
}> {
  return this.http.get<any>(`${this.apiUrl}/dashboard/sales-trend?view=${view}`);

}

}