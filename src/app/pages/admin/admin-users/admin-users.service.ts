import { CommonService } from '@/layout/service/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AdminUser {
  id: number;
  username: string;
  email: string | null;
  phoneNumber: string | null;
  roles: string[];
  enabled: boolean;
  emailVerified: boolean;
  phoneNumberVerified: boolean;
  preferredPurchaseType: string;
  createdOn: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {
  commonService: CommonService = new CommonService();
  private baseUrl = this.commonService.baseUrl;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.baseUrl}/admin/users`);
  }

  updateRole(id: number, role: string): Observable<AdminUser> {
    const params = new HttpParams().set('role', role);
    return this.http.put<AdminUser>(`${this.baseUrl}/admin/users/${id}/role`, null, { params });
  }

  toggleStatus(id: number, status: boolean): Observable<AdminUser> {
    const params = new HttpParams().set('status', status);
    return this.http.put<AdminUser>(`${this.baseUrl}/admin/users/${id}/status`, null, { params });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/users/${id}`);
  }
}
