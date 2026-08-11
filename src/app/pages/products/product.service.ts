import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  purchaseType?: string;
  uploadedAt: string;
  uploadedBy: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
  active: boolean;
  parentId: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  commonService: CommonService = new CommonService();
  private apiUrl = this.commonService.baseUrl;

  private wishlistCountSubject = new BehaviorSubject<number>(0);
  wishlistCount$ = this.wishlistCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllProducts(page: any, size: any): Observable<ProductResponse> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<ProductResponse>(`${this.apiUrl}/products/all-products`, { params });
  }

  getRelatedProductsByCategory(categoryId: number, page = 0, size = 10): Observable<ProductResponse> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<ProductResponse>(
      `${this.apiUrl}/products/search/category/${categoryId}`,
      { params }
    );
  }

  searchProducts(searchPayload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/products/category/search`, searchPayload);
  }

  getProductByVariantId(variantId: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/variants/${variantId}`);
  }

  getProductByVariantSlug(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/variants/slug/${slug}`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  getBestSellers(limit = 8): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/best-sellers`, { params: { limit } });
  }

  getProductBySlug(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/slug/${slug}`);
  }

  getSimilarProducts(variantId: number): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products/variants/${variantId}/similar`, {});
  }

  updateVariant(variantId: number, formData: FormData) {
    return this.http.post<any>(`${this.apiUrl}/admin/products/variants/${variantId}`, formData);
  }

  upload(formData: FormData) {
    return this.http.post<any>(`${this.apiUrl}/admin/products/images/upload`, formData);
  }

  addVariant(productParentId: any, formData: FormData) {
    return this.http.post<any>(`${this.apiUrl}/admin/products/${productParentId}/variants`, formData);
  }

  updateProduct(productId: number, request: any) {
    return this.http.put<any>(`${this.apiUrl}/admin/products/${productId}`, request);
  }

  deleteProduct(productId: number) {
    return this.http.delete<any>(`${this.apiUrl}/admin/products/${productId}`);
  }

  deleteVariant(variantId: number) {
    return this.http.delete<any>(`${this.apiUrl}/admin/products/variants/${variantId}`);
  }

  notifyStock(variantId: number, isLoggedIn: boolean, sizeId: number, email: string | null) {
    let options = {};
    if (isLoggedIn) {
      const token = localStorage.getItem('token');
      options = {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`
        })
      };
    }
    return this.http.post<any>(
      `${this.apiUrl}/interest/variants/${variantId}/stock-interest`,
      { email },
      options
    );
  }

  checkParentProduct(params: { name: string, category: string, subCategory: string }) {
    const queryParams = new HttpParams()
      .set('name', params.name)
      .set('category', params.category)
      .set('subCategory', params.subCategory);

    return this.http.post<any>(
      `${this.apiUrl}/admin/products/check-parent`,
      {},
      { params: queryParams }
    );
  }

  getAutocompleteSuggestions(query: string) {
    return this.http.get<any>(`${this.apiUrl}/products/search/autocomplete?query=${encodeURIComponent(query)}`);
  }

  getSearchedProducts(query: string, page: number = 0, size: number = 10) {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(`${this.apiUrl}/products/search`, { params });
  }

  getWishlist(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/wishlist/get-wishlist`).pipe(
      tap((res) => {
        this.wishlistCountSubject.next(res?.length || 0);
      })
    );
  }

  addToWishlist(variantId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/wishlist/add/${variantId}`, {}).pipe(
      tap(() => this.refreshWishlistCount())
    );
  }

  removeFromWishlist(variantId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/wishlist/remove/${variantId}`, {}).pipe(
      tap(() => this.refreshWishlistCount())
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

  // Category methods
  getRootCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories/root`);
  }

  getSubCategories(parentId: number): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories/${parentId}/subcategories`);
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories`, category);
  }

  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/categories/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}`);
  }

  // Banner methods
  getAllBanners(): Observable<Banner[]> {
    return this.http.get<Banner[]>(`${this.apiUrl}/banners/all-banners`);
  }

  // Multi-variant product methods
  createProductWithVariants(formData: FormData) {
    return this.http.post<any>(`${this.apiUrl}/admin/products/create-with-variants`, formData);
  }

  updateProductWithVariants(productId: number, formData: FormData) {
    return this.http.put<any>(`${this.apiUrl}/admin/products/${productId}/update-with-variants`, formData);
  }

  importExcel(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/products/import-excel`, formData);
  }
}
