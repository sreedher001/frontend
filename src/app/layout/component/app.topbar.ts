import { Component, OnInit } from '@angular/core';
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

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, BadgeModule, OverlayBadgeModule],
    template: ` <div class="layout-topbar">
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
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
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
                </div>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-inbox"></i>
                        <span>Messages</span>
                    </button>
                    <button type="button" class="layout-topbar-action" (click)="viewCart()">
                        <p-overlayBadge *ngIf="cartCount > 0" severity="danger" [value]="cartCount" styleClass="p-overlay-badge-cart">
                            <i class="pi pi-shopping-bag" style="font-size: 1.5rem"></i>
                        </p-overlayBadge>
                        <span>Cart</span>
                    </button>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar {
    
    items!: MenuItem[];
    cart: CartResponse = {
        cartId: 0,
        items: []
    };
    cartCount: number = 0;
    constructor(public layoutService: LayoutService, private cartService: CartService,
        private router: Router) {
        //this.cartCount = this.loadCartCount();

    }
    loadCartCount(): number {
        this.cartService.getCart().subscribe({
            next: (res) => {
                this.cart = res;
                this.cartCount = res.items.length;
            },
            error: (err) => {
                console.error('Failed to load cart', err);
            }
        });
        return this.cartCount
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
    viewCart() {
        this.router.navigate(['/cart']);
    }
}
