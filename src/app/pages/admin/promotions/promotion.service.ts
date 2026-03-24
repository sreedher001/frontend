import { CommonService } from '@/layout/service/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Promotion } from './promotion.modal';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  
  commonService:CommonService = new CommonService;
            private baseUrl = this.commonService.baseUrl;

  constructor(private http: HttpClient) {}

  getPromotions(): Observable<Promotion[]> {
  return this.http.get<Promotion[]>(`${this.baseUrl}/admin/promotions/allPromotions`);
}

createPromotion(promo: Promotion): Observable<Promotion> {
  return this.http.post<Promotion>(`${this.baseUrl}/admin/promotions/create`, promo);
}

updatePromotion(id: number, promo: Promotion): Observable<Promotion> {
  return this.http.post<Promotion>(`${this.baseUrl}/admin/promotions/update/${id}`, promo);
}

deletePromotion(id: number): Observable<void> {
  return this.http.post<void>(`${this.baseUrl}/admin/promotions/delete/${id}`, {});
}
}
