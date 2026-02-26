import { CommonService } from '@/layout/service/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminStockInterest } from './admin-stock-interest.model';

@Injectable({
  providedIn: 'root'
})
export class AdminStockInterestService {
  
  commonService:CommonService = new CommonService;
            private baseUrl = this.commonService.baseUrl;

  constructor(private http: HttpClient) {}

  getStockInterest(): Observable<AdminStockInterest[]> {
    return this.http.get<AdminStockInterest[]>(`${this.baseUrl}/admin/stock-interest/intrested-items`);

  }
}
