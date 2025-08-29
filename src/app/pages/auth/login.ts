import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { LoginRequest, LoginService } from './login.service';
import { JwtHelper } from '@/jwt/jwt-helper';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 animated-bg flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
  <img
    src="/assets/images/logo.png"
    alt="ZFC Logo"
    class="mx-auto mb-8 w-32 sm:w-40 md:w-48 h-auto object-contain"
  />
  <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">
    Welcome to ZFC!
  </div>
  <span class="text-muted-color font-medium">Sign in to continue</span>
</div>


                        <div>
                            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                            <input pInputText id="email1" type="text" placeholder="Email address" class="w-full md:w-120 mb-8" [(ngModel)]="email" />

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                            <p-password id="password1" [(ngModel)]="password" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                <div class="flex items-center">
                                    <p-checkbox [(ngModel)]="checked" id="rememberme1" binary class="mr-2"></p-checkbox>
                                    <label for="rememberme1">Remember me</label>
                                </div>
                                <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
                            </div>
                            <p-button label="Sign In" styleClass="w-full" (onClick)="onLogin()"></p-button>

                        </div>
                    </div>
                </div>
            </div>
        </div>`
})
export class Login {
    email: string = '';

    password: string = '';

    checked: boolean = false;

    constructor(private loginService: LoginService, private router: Router,private jwtHelper:JwtHelper) { }

    onLogin() {
        const loginPayload: LoginRequest = {
            email: this.email,
            password: this.password
        };

        this.loginService.loginUser(loginPayload).subscribe({
            next: (res) => {
                console.log('Login success', res);
                const token = res?.token; // Make sure `res.token` contains the JWT
                if (token) {
                    localStorage.setItem('authToken', token);
                    localStorage.setItem('isLoggedIn',"true");
                    const userInfo =  this.jwtHelper.getUserInfo();
                    localStorage.setItem('userName', userInfo?.name);
                }

                this.router.navigate(['/products']);
                this.email="";
                this.password="";
            },
            error: (err) => {
                console.error('Login failed', err);
                this.email="";
                this.password="";
            }
        });
    }

}
