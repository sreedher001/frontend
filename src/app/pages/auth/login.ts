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
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule], //AppFloatingConfigurator
    template: `
        <!-- <app-floating-configurator /> -->
        <div class="w-full max-w-md mx-auto bg-white dark:bg-surface-900 p-6 sm:p-8 rounded-2xl shadow-lg">
  <div class="text-center mb-6">
    <img
      src="/assets/images/logo.png"
      alt="ZFC Logo"
      class="mx-auto mb-4 w-24 sm:w-32 h-auto object-contain"
    />
    <!-- <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0">Welcome to ZFC</h2> -->
    <p class="text-lg text-gray-500 dark:text-gray-400">Sign in and continue shopping</p>
  </div>

  <div class="space-y-6">
    <div>
      <label for="email1" class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
      <input
        pInputText
        id="email1"
        type="text"
        placeholder="Email address"
        class="w-full"
        [(ngModel)]="email"
      />
    </div>

    <div>
      <label for="password1" class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Password</label>
      <p-password
  [(ngModel)]="password"
  id="password1"
  placeholder="Password"
  [toggleMask]="true"
  [feedback]="false"
  [inputStyle]="{ width: '100%' }"
  styleClass="w-full"
></p-password>
    </div>

    <div class="flex justify-between items-center text-sm">
      <div class="flex items-center">
        <p-checkbox
          [(ngModel)]="checked"
          id="rememberme1"
          binary
          class="mr-2"
        ></p-checkbox>
        <label for="rememberme1" class="text-gray-600 dark:text-gray-400">Remember me</label>
      </div>
      <a class=" font-medium hover:underline cursor-pointer">Forgot password?</a>
    </div>

    <p-button severity="warn"
      label="Sign In"
      styleClass="w-full"
      (onClick)="onLogin()"
    ></p-button>
  </div>
</div>
`
})
export class Login {
    email: string = '';

    password: string = '';

    checked: boolean = false;

    constructor(private loginService: LoginService, private router: Router, private jwtHelper: JwtHelper, private messageService: MessageService) { }

    onLogin() {
        const loginPayload: LoginRequest = {
            email: this.email,
            password: this.password
        };

        this.loginService.loginUser(loginPayload).subscribe({
            next: (res) => {
                this.messageService.add({
                    key: 'global',
                    severity: 'success',
                    summary: 'TADA! You’re in!',
                    //detail: err.error?.message || 'Username/password is incorrect'
                    detail:'Welcome to ZFC — ready to shop? Let’s go!',
                    sticky:false
                });
                console.log('Login success', res);
                const token = res?.token; // Make sure `res.token` contains the JWT
                if (token) {
                    localStorage.setItem('authToken', token);
                    localStorage.setItem('isLoggedIn', "true");
                    const userInfo = this.jwtHelper.getUserInfo();
                    localStorage.setItem('userName', userInfo?.name);
                }

                this.router.navigate(['/']);
                this.email = "";
                this.password = "";
            },
            error: (err) => {

                this.email = "";
                this.password = "";
                this.messageService.add({
                    key: 'global',
                    severity: 'error',
                    summary: 'Login Failed',
                    //detail: err.error?.message || 'Username/password is incorrect'
                    detail:'Username/password is incorrect',
                    sticky:true
                });

            }
        });
    }

}
