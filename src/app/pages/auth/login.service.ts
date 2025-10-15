import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
      // {
      //  // withCredentials: true, // ensures cookies like JWT are sent/received
      //   headers: new HttpHeaders({
      //     'Content-Type': 'application/json'
      //   })
      // }
    );
  }


   signup(payload: any): Observable<any> {
    return this.http.post(this.baseUrl+"/auth/signup", payload);
  }



sendForgotOtp(email: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/auth/forgot-password?email=${encodeURIComponent(email)}`, {});
}


  //  Update: Verify OTP 
verifyOtp(email: string, otp: string): Observable<any> {
  const params = new HttpParams()
    .set('email', email)
    .set('otp', otp);

  return this.http.post(`${this.baseUrl}/auth/verify-otp`,{}, { params });
}

  //  POST 
 resetPassword(email: string, otp: string, password: string): Observable<any> {
  const params = new HttpParams()
    .set('email', email)
    .set('otp', otp)
    .set('password', password);

  return this.http.post(`${this.baseUrl}/auth/reset-password`,{}, { params });
}

subscribeNewsletter(email: string): Observable<any> {
        const params = new HttpParams()
    .set('email', email);

  return this.http.post(`${this.baseUrl}/newsletter/subscribe`,{}, { params });
    }

}
