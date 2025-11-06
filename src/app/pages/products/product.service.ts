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
// AI
export interface AiUserPromptRequest {
  prompt: string;
}
//AI
export interface ProductDto {
  name: string;
  productId: string;
  category: string;
  subCategory: string;
  color: string;
  images: string[]; // list of image URLs (we take the first one for display)
  rating: number;
  isFeatured: boolean;
}
//AI
export interface AiSuggestionResponse {
  products: ProductDto[];
}


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  

  commonService:CommonService = new CommonService;
      private apiUrl = this.commonService.baseUrl;

      private wishlistCountSubject = new BehaviorSubject<number>(0);
wishlistCount$ = this.wishlistCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllProducts(page:any, size :any): Observable<ProductResponse> {
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

  getSimilarProducts(variantId: number): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products/variants/${variantId}/similar`,{});
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

addVariant(productParentId:any,formData: FormData) {
  return this.http.post<any>(
    `${this.apiUrl}/admin/products/${productParentId}/variants`,  
    formData
  );
}

checkParentProduct(params: {
  name: string,
  category: string,
  genderCategory: string,
  subCategory: string
}) {
  const queryParams = new HttpParams()
    .set('name', params.name)
    .set('category', params.category)
    .set('genderCategory', params.genderCategory)
    .set('subCategory', params.subCategory);

  return this.http.post<any>(
    `${this.apiUrl}/admin/products/check-parent`,
    {}, // empty body
    { params: queryParams }
  );
}

// product.service.ts
getAutocompleteSuggestions(query: string) {
  return this.http.get<any>(`${this.apiUrl}/products/search/autocomplete?query=${encodeURIComponent(query)}`);
}

getSearchedProducts(query: string,page: number = 0, size: number = 10){

  const params = new HttpParams()
    .set('query', query)
    .set('page', page)
    .set('size', size);
  return this.http.get<any>(`${this.apiUrl}/products/search`,{params });
}

getWishlist(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/wishlist/get-wishlist`).pipe(
      tap((res) => {
        //update BehaviorSubject with new count
        this.wishlistCountSubject.next(res?.length || 0);
      })
    );
  }

// addToWishlist(variantId: number): Observable<any> {
//     return this.http.post(`${this.apiUrl}/wishlist/add/${variantId}`, {});
//   }

//   removeFromWishlist(variantId: number): Observable<any> {
//     return this.http.post(`${this.apiUrl}/wishlist/remove/${variantId}`, {});
//   }
addToWishlist(variantId: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/wishlist/add/${variantId}`, {}).pipe(
    tap(() => this.refreshWishlistCount()) //  update count after add
  );
}

removeFromWishlist(variantId: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/wishlist/remove/${variantId}`, {}).pipe(
    tap(() => this.refreshWishlistCount()) //  update count after remove
  );
}

refreshWishlistCount() {
  this.getWishlist().subscribe({
    next: (items) => {
      const count = items?.length || 0;
      this.wishlistCountSubject.next(count);
    },
    error: () => this.wishlistCountSubject.next(0)
  });
}


  getWearType(wearType: any,page: number = 0, size: number = 10){

  const params = new HttpParams()
    .set('query', wearType)
    .set('page', page)
    .set('size', size);
  return this.http.get<any>(`${this.apiUrl}/products/search/weartype`,{params });
}


//==================AI API===============
getRecommendations(prompt: string): Observable<AiSuggestionResponse> {
    const request: AiUserPromptRequest = { prompt };
    return this.http.post<AiSuggestionResponse>(`${this.apiUrl}/ai/suggestions`, request);
  }

  getAllBanners(): Observable<Banner[]> {
    return this.http.get<Banner[]>(`${this.apiUrl}/banners/all-banners`);
  }
}
