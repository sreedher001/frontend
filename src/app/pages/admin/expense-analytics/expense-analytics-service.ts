import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonService } from '@/layout/service/common';

@Injectable({
  providedIn: 'root'
})
export class ExpenseAnalyticsService {
   commonService:CommonService = new CommonService;
              private baseUrl = this.commonService.baseUrl;
  
    constructor(private http: HttpClient) {}

    getSummary(start: string, end: string) {
    return this.http.get(`${this.baseUrl}/admin/expense-analytics/summary`, {
      params: { start, end }
    });
  }

  getCategory(start: string, end: string) {
    return this.http.get<any[]>(`${this.baseUrl}/admin/expense-analytics/category`, {
      params: { start, end }
    });
  }

  getPayment(start: string, end: string) {
    return this.http.get<any[]>(`${this.baseUrl}/admin/expense-analytics/payment`, {
      params: { start, end }
    });
  }

  getMonthly(start: string, end: string) {
    return this.http.get<any[]>(`${this.baseUrl}/admin/expense-analytics/monthly`, {
      params: { start, end }
    });
  }

}
