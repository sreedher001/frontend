import { CommonService } from '@/layout/service/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminReviewService {
  
  commonService:CommonService = new CommonService;
            private baseUrl = this.commonService.baseUrl;

  constructor(private http: HttpClient) {}
  getReviews(
    page: number,
    size: number,
    sortBy: any,
    direction: 'asc' | 'desc'
  ): Observable<any> {

    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortBy', sortBy)
      .set('direction', direction);

    return this.http.get<any>(`${this.baseUrl}/admin/reviews/all-reviews`, { params });
  }
}
