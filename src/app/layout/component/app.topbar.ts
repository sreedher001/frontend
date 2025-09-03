import { Component, NgModule, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { BadgeModule } from 'primeng/badge';
import { CartService } from '@/pages/cart/cart.service';
import { Cart } from '@/pages/cart/cart';
import { CartResponse } from '@/pages/cart/cart.model';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { JwtHelper } from '@/jwt/jwt-helper';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule,//AppConfigurator, 
    BadgeModule,
        MenuModule, OverlayBadgeModule, ButtonModule, TooltipModule],
    template: `<div class="layout-topbar">
    <div class="layout-topbar-logo-container">
        <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>
        <a class="layout-topbar-logo" routerLink="/products">
            <img src="assets/images/logo.png" alt="ZFC" style="height: 50px;" />
            <span>ZFC</span>
        </a>
    </div>

    <div class="layout-topbar-actions">
        <div class="layout-config-menu">
            <!-- Dark Mode Toggle (Commented) -->
            <!--
            <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
            </button>
            -->

            <!-- Color Picker (Commented) -->
            
            <!-- <div class="relative">
                <button
                    class="layout-topbar-action layout-topbar-action-highlight"
                    pStyleClass="@next"
                    enterFromClass="hidden"
                    enterActiveClass="animate-scalein"
                    leaveToClass="hidden"
                    leaveActiveClass="animate-fadeout"
                    [hideOnOutsideClick]="true"
                >
                    <i class="pi pi-palette"></i>
                </button>
                <app-configurator />
            </div> -->
           
        </div>

        <!-- <button
            class="layout-topbar-menu-button layout-topbar-action"
            pStyleClass="@next"
            enterFromClass="hidden"
            enterActiveClass="animate-scalein"
            leaveToClass="hidden"
            leaveActiveClass="animate-fadeout"
            [hideOnOutsideClick]="true"
        >
            <i class="pi pi-ellipsis-v"></i>
        </button> -->

       <!-- START: Icons Always Visible -->
<div class="layout-topbar-menu-content w-full">
  <div class="flex flex-row items-center justify-end gap-3 flex-nowrap overflow-x-auto w-full">

    <!-- Messages -->
    <button type="button" class="layout-topbar-action raised flex items-center shrink-0">
      <i class="pi pi-inbox"></i>
      <span class="hidden sm:inline">Messages</span>
    </button>

    <!-- Cart Button -->
    <button 
      type="button" 
      class="relative flex items-center justify-center bg-pink-100 dark:bg-pink-400/10 rounded-border shrink-0" 
      style="width: 2.5rem; height: 2.5rem;" 
      (click)="viewCart()"
      pTooltip="View items in your bag" 
      tooltipPosition="top"
    >
      <i class="cart-button pi pi-shopping-bag text-pink-500 text-xl"></i>
      @if(cartCount > 0) {
        <span class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none z-10">
          {{ cartCount }}
        </span>
      }
    </button>

    <!-- User Button -->
    <button 
      type="button" 
      class="flex items-center justify-center bg-orange-100 dark:bg-blue-400/10 rounded-border shrink-0" 
      style="width: 2.5rem; height: 2.5rem;" 
      (click)="menu.toggle($event)"
      #menuButton
    >
      <i class="pi pi-user text-orange-500 text-xl"></i>
    </button>

    <!-- User Menu -->
    <p-menu 
      #menu 
      [popup]="true" 
      [model]="overlayMenuItems" 
      [baseZIndex]="1000" 
      [appendTo]="'body'"
    ></p-menu>
  </div>
</div>

<!-- END: Icons Always Visible -->

    </div>
</div>
`
})
export class AppTopbar implements OnInit {

    items!: MenuItem[];
    cart: CartResponse = {
        cartId: 0,
        items: []

    };
    isLoggedIn: boolean = false;
    cartCount: number = 0;
    userName:any ='';
    overlayMenuItems: MenuItem[] = [];
     ngOnInit(): void {
        this.setUserMenuItem();

    }
     constructor(public layoutService: LayoutService, private cartService: CartService,
        private router: Router,private jwtHelper:JwtHelper) {


    }
    setUserMenuItem(){
const loggedIn = localStorage.getItem('isLoggedIn');
        if (loggedIn === "true") {
            this.isLoggedIn = true;
            const name= localStorage.getItem('userName')?localStorage.getItem('userName'):"";
           this.userName = name;
        
        this.overlayMenuItems = [
        { label: 'Hello, '+this.userName, icon: 'pi pi-user' },
        { separator: true },
        {
            label: 'My Profile',
            icon: 'pi pi-id-card'
        },
        {
            label: 'My Orders',
            icon: 'pi pi-box'
        },
        {
            label: 'Wishlist',
            icon: 'pi pi-heart'
        },
        {
            label: 'Settings',
            icon: 'pi pi-cog'
        },
        {
            separator: true
        },
        { label: 'Logout',icon: 'pi pi-sign-out', command: () => this.logout()}
    ];}
    else{
        this.overlayMenuItems = [
        { label: 'Login', icon: 'pi pi-sign-in', command: () => this.login() },
        { label: 'Sign Up', icon: 'pi pi-user-plus', command: () => this.signup() }
      ];
    }}

    logout() {
        this.router.navigate(['/auth/login']);
        this.isLoggedIn = false;
        localStorage.setItem('isLoggedIn', "false");

        localStorage.removeItem('username');
       this.jwtHelper.logout();
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
    viewCart() {
        this.router.navigate(['/cart']);
    }
    signup() {
        this.router.navigate(['/auth/signup']);
    }
    login() {
        this.router.navigate(['/auth/login']);
    }
}

