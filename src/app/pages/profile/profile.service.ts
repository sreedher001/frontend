import { CommonService } from '@/layout/service/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  commonService:CommonService = new CommonService;
          private baseUrl = this.commonService.baseUrl;

  constructor(private http: HttpClient) {}

  sendOtp(field: string, value: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/send-otp`, { field, value });
  }

  verifyOtp(field: string, value: string, otp: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/verify-otp`, { field, value, otp });
  }
}
