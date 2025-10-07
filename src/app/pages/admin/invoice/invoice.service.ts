import { CommonService } from '@/layout/service/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  

  getInvoicesByDateRange(startDate: string, endDate: string, page: number = 0, size: number = 10): Observable<any> {
  const params = new HttpParams()
    .set('startDate', startDate)
    .set('endDate', endDate)
    .set('page', page.toString())
    .set('size', size.toString());

  return this.http.get(`${this.baseUrl}/invoices/all-invoices`, { params });
}
 
    commonService:CommonService = new CommonService;
            private baseUrl = this.commonService.baseUrl;

  constructor(private http: HttpClient) {}

  uploadInvoice(formData: FormData): Observable<any> {
  return this.http.post<any>(
    `${this.baseUrl}/invoices/upload-invoice`,  
    formData
  );
}

deleteInvoice(id: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/invoices/${id}`,{});
  }
}
