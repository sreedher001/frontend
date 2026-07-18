import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CommonService } from '@/layout/service/common';

@Injectable({
  providedIn: 'root'
})
export class Addproductservice {

  commonService: CommonService = new CommonService();
  private apiUrl = this.commonService.baseUrl;

  constructor(private http: HttpClient) {}

  getCategoryTree(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/categories`).pipe(
      map((categories: any[]) => this.buildTreeNodes(categories))
    );
  }

  private buildTreeNodes(categories: any[]): any[] {
    const parentCategories = categories.filter(c => !c.parentId);
    return parentCategories.map(c => ({
      label: c.name,
      data: { id: c.id, name: c.name },
      children: this.buildChildNodes(c.id, categories)
    }));
  }

  private buildChildNodes(parentId: number, all: any[]): any[] {
    const children = all.filter(c => c.parentId === parentId);
    if (children.length === 0) return [];
    return children.map(c => ({
      label: c.name,
      data: { id: c.id, name: c.name },
      children: this.buildChildNodes(c.id, all)
    }));
  }

  getAllProductName() {
    return this.http.get<any>(`${this.apiUrl}/admin/products/productname`);
  }
}
