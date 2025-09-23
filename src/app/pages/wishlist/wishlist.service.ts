import { CommonService } from '@/layout/service/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  commonService:CommonService = new CommonService;
          private baseUrl = this.commonService.baseUrl;

  constructor(private http: HttpClient) {}

  getWishlist(): Observable<any> {
    return this.http.get(`${this.baseUrl}/wishlist/get-wishlist`);
  }
}
