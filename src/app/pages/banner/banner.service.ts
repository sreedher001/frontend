import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ProductResponse } from '@/models/product-response.model';
import { Product } from '@/models/product.model';
import { CommonService } from '@/layout/service/common';
export interface Banner {
  id: number;
  imageUrl: string;
  mobileImageUrl?: string;
  title: string;
  redirectUrl: string;
  bannerType: string;
  purchaseType?: string;
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

  uploadBanner(files: File[], metadata: any, mobileFile?: File | null): Observable<any> {
    const formData = new FormData();

    // append files (multiple supported)
    files.forEach(file => {
      formData.append('file', file);
    });

    if (mobileFile) {
      formData.append('mobileFile', mobileFile);
    }

    // append metadata JSON string
    formData.append('metadata', JSON.stringify(metadata));



    return this.http.post(`${this.apiUrl}/banners/upload`, formData);
  }



  updateBanner(id: number, dto: any, file?: File | null, mobileFile?: File | null): Observable<any> {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    if (mobileFile) {
      formData.append('mobileFile', mobileFile);
    }
    formData.append('metadata', JSON.stringify(dto));
    return this.http.post(`${this.apiUrl}/banners/update/${id}`, formData);
  }

  deleteBanner(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/banners/delete/${id}`, {});
  }
}
