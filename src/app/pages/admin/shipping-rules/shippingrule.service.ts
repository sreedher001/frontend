import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShippingRule } from './shipping-rule.model';
import { CommonService } from '@/layout/service/common';

@Injectable({
  providedIn: 'root'
})
export class ShippingruleService {
  

   commonService:CommonService = new CommonService;
              private baseUrl = this.commonService.baseUrl;
  api=this.baseUrl + '/admin/shipping-rules';
    constructor(private http: HttpClient) {}

  getAll(): Observable<ShippingRule[]> {
    return this.http.get<ShippingRule[]>(`${this.api}/all-shipping-rules`);
  }

  getById(id: number): Observable<ShippingRule> {
    return this.http.get<ShippingRule>(`${this.api}/${id}`);
  }

  create(rule: ShippingRule): Observable<ShippingRule> {
    return this.http.post<ShippingRule>(`${this.api}/create`, rule);
  }

  update(id: number, rule: ShippingRule): Observable<ShippingRule> {
    return this.http.post<ShippingRule>(`${this.api}/update/${id}`, rule);
  }

  delete(id: number) {
    return this.http.post(`${this.api}/delete/${id}`, {});
  }
}
