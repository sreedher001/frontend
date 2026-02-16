import { CommonService } from '@/layout/service/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PendingReview } from './pending-review.model';
import { ReviewRequest } from './review-request.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  
  commonService:CommonService = new CommonService;
        private baseUrl = this.commonService.baseUrl;
  constructor(private http: HttpClient) {}

  getPendingReviews() {
    return this.http.get<PendingReview[]>(`${this.baseUrl}/reviews/pending`);
  }

  submitReview(payload: ReviewRequest) {
    return this.http.post(`${this.baseUrl}/reviews/submit`, payload);
  }


  getReviews(variantId: number, page: number, size: number) {
  return this.http.get(
    `${this.baseUrl}/reviews/${variantId}/reviews`,
    {
      params: {
        page,
        size,
        sortBy: 'createdAt',
        direction: 'desc'
      }
    }
  );
}

}
