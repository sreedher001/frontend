import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductResponse } from '@/models/product-response.model';
import { Product } from '@/models/product.model';
import { CommonService } from '@/layout/service/common';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  //private apiUrl = 'http://localhost:8080/dev/api';

  commonService:CommonService = new CommonService;
      private apiUrl = this.commonService.baseUrl;

  constructor(private http: HttpClient) {}

  getAllProducts(page = 0, size = 10): Observable<ProductResponse> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<ProductResponse>(`${this.apiUrl}/products/all-products`, { params });

  }

//   getProductById(id: number): Observable<Product> {
//   return this.http.get<Product>(`${this.apiUrl}/products/search/${id}` );
// }

getRelatedProductsByCategory(category: string, page = 0, size = 10): Observable<ProductResponse> {
  const params = new HttpParams()
    .set('page', page)
    .set('size', size);

  return this.http.get<ProductResponse>(
    `${this.apiUrl}/products/search/category/${category}`, 
    { params }
  );
}

getProductByVariantId(variantId: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/variants/${variantId}`);
  }

  updateVariant(variantId: number, formData: FormData) {
  return this.http.post<any>(
    `${this.apiUrl}/admin/products/variants/${variantId}`,  
    formData
  );
}

upload(formData: FormData) {
  return this.http.post<any>(
    `${this.apiUrl}/admin/products/images/upload`,  
    formData
  );
}

  


}
