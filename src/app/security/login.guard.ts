// login.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelper } from '../jwt/jwt-helper'
@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private router: Router, private jwtHelper: JwtHelper) {}

  canActivate(): boolean {
     const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

        if (isLoggedIn) {
            const roles: string[] = this.jwtHelper.getUserRoles();
console.log("roles",roles);
            if (roles.includes('ROLE_USER')) {
                return true;
            }
        }
     this.router.navigate(['/notfound']);
        return false;
  }
}
