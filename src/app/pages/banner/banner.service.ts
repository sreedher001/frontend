import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ProductResponse } from '@/models/product-response.model';
import { Product } from '@/models/product.model';
import { CommonService } from '@/layout/service/common';
export interface Banner {
  id: number;
  imageUrl: string;
  title: string;
  redirectUrl: string;
  bannerType: string;
  uploadedAt: string;
  uploadedBy: number;
}



@Injectable({
  providedIn: 'root'
})
export class BannerService {
  

  commonService:CommonService = new CommonService;
      private apiUrl = this.commonService.baseUrl;

      constructor(private http: HttpClient) {}

  getAllBanners(): Observable<Banner[]> {
    return this.http.get<Banner[]>(`${this.apiUrl}/banners/all-banners`);
  }

  uploadBanner(files: File[], metadata: any): Observable<any> {
    const formData = new FormData();

    // append files (multiple supported)
    files.forEach(file => {
      formData.append('file', file);
    });

    // append metadata JSON string
    formData.append('metadata', JSON.stringify(metadata));

    

    return this.http.post(`${this.apiUrl}/banners/upload`, formData);
  }

 

  updateBanner(id: number, dto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/banners/update/${id}`, dto);
  }

  deleteBanner(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/banners/delete/${id}`, {});
  }
}
