import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelper } from '../jwt/jwt-helper'

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private jwtHelper: JwtHelper) { }

    canActivate(): boolean {

        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

        if (isLoggedIn) {
            const roles: string[] = this.jwtHelper.getUserRoles();

            if (roles.includes('ROLE_ADMIN')) {
                return true;
            }
        }



        // Not an admin, redirect
        this.router.navigate(['/notfound']);
        return false;
    }
}
