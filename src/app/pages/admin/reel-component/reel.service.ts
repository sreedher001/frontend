import { CommonService } from '@/layout/service/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReelService {
  
   commonService:CommonService = new CommonService;
        private apiUrl = this.commonService.baseUrl;
 constructor(private http: HttpClient) {}

        getAllReels(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reels/all-reel`);
  }

  /**
   * Add view to reel
   */
  addView(reelId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${reelId}/reels/view`, {});
  }

  /**
   * Toggle like
   */
  toggleLike(reelId: number, userId?: number, deviceId?: string): Observable<any> {

    const body = {
      reelId: reelId,
      userId: userId,
      deviceId: deviceId
    };

    return this.http.post(`${this.apiUrl}/reels/toggle-like`, body);
  }

  // CREATE
  createReel(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/reels/create`, payload);
  }

  // UPDATE
  updateReel(id: number, payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/reels/update/${id}`, payload);
  }

  // DELETE
  deleteReel(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/reels/delete/${id}`, {});
  }

}
