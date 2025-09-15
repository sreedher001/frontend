import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductResponse } from '@/models/product-response.model';
import { Product } from '@/models/product.model';
import { CommonService } from '@/layout/service/common';
@Injectable({
  providedIn: 'root'
})
export class Addproductservice {
  
  
   commonService:CommonService = new CommonService;
      private apiUrl = this.commonService.baseUrl;

  constructor(private http: HttpClient) {}

  getCategory(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/products/category`);
  }

  getGenderCategory(categoryId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/products/category/${categoryId}/gendercategory`);
  }

   getSubCategory(genderCategoryId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/products/gendercategory/${genderCategoryId}/subcategory`);
  }
  getAllProductName() {
    return this.http.get<any>(`${this.apiUrl}/admin/products/productname`);
  }

  getStyleCategory(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/products/stylecategory`);
  }
}
