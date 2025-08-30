import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonService } from '@/layout/service/common';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  roles: string[];
  token: string; // You are returning jwtCookie.toString()
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
    commonService:CommonService = new CommonService;
    private baseUrl = this.commonService.baseUrl;

  constructor(private http: HttpClient) {}

  loginUser(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
     this.baseUrl+"/auth/signin",
      loginRequest,
      {
       // withCredentials: true, // ensures cookies like JWT are sent/received
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    );
  }
}
