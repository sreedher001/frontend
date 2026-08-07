import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { JwtHelper } from '@/jwt/jwt-helper';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `
    @if(isAdmin){<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            @if(!item.separator){<li app-menuitem  [item]="item" [index]="i" [root]="true"></li>}
            @if(item.separator){<li class="menu-separator"></li>}
        </ng-container>
    </ul>}
`
})


export class AppMenu {
    model: MenuItem[] = [];
    constructor(private jwtHelper:JwtHelper){}
isAdmin=false;

    ngOnInit() {
        if(localStorage.getItem("isLoggedIn")==="true"){
            const roles = this.jwtHelper.getUserRoles();
            if(roles.includes("ROLE_ADMIN")){
                this.isAdmin = true;
            }
        }
        if(this.isAdmin){
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/admin/dashboard'] },
                    { label: 'Sales Trend', icon: 'pi pi-chart-line', routerLink: ['/admin/sales/trend'] },
                ]
            },
            {
                label: 'Catalog',
                items: [
                    { label: 'Add New Product', icon: 'pi pi-fw pi-plus', routerLink: ['/admin/products/add'] },
                    { label: 'Manage Products', icon: 'pi pi-fw pi-cog', routerLink: ['/admin/products/manageproducts'] },
                    { label: 'Categories', icon: 'pi pi-sitemap', routerLink: ['/admin/categories'] },
                    { label: 'Stock Requests', icon: 'pi pi-bell', routerLink: ['/admin/stock-interest'] },
                    { label: 'Reviews', icon: 'pi pi-star', routerLink: ['/admin/reviews'] },
                ]
            },
            {
                label: 'Sales',
                items: [
                    { label: 'Manage Orders', icon: 'pi pi-fw pi-cog', routerLink: ['/admin/orders'] },
                    { label: 'Returns', icon: 'pi pi-box', routerLink: ['/admin/returns-view'] },
                    { label: 'Promotions', icon: 'pi pi-tags', routerLink: ['/admin/promotions'] },
                    { label: 'Shipping Rules', icon: 'pi pi-pen-to-square', routerLink: ['/admin/shipping-rules'] },
                ]
            },
            {
                label: 'Customers',
                items: [
                    { label: 'Customers', icon: 'pi pi-users', routerLink: ['/admin/customers'] },
                ]
            },
            {
                label: 'Finance',
                items: [
                    { label: 'Register Expense', icon: 'pi pi-receipt', routerLink: ['/admin/invoice'] },
                    { label: 'View Expense', icon: 'pi pi-eye', routerLink: ['/admin/invoice-list'] },
                ]
            },
            {
                label: 'Content',
                items: [
                    { label: 'Banners', icon: 'pi pi-image', routerLink: ['/admin/banner'] },
                    { label: 'Reels', icon: 'pi pi-video', routerLink: ['/admin/reels'] },
                ]
            },
            {
                label: 'Settings',
                items: [
                    { label: 'Store Settings', icon: 'pi pi-cog', routerLink: ['/admin/store-settings'] },
                ]
            },

        ];
        }
    }
}
