import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtHelper {
    
  decodeToken(token: string): any {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('JWT must have 3 parts');
    }

    const payload = parts[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUserDetails(): any {
    const token = this.getToken();
    if (!token) return null;
    return this.decodeToken(token);
  }

  getUserRoles(): string[] {
    const user = this.getUserDetails();
    return user?.roles || [];
  }

   getUserInfo(): any {
    const user = this.getUserDetails();
    return user;
  }

  isTokenExpired(): boolean {
    const user = this.getUserDetails();
    if (!user?.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return user.exp < now;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isLoggedeIn');
    localStorage.removeItem('userName');
  }
}
