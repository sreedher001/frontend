import { ChangeDetectorRef, Component, NgModule, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
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
import { AutoCompleteModule } from 'primeng/autocomplete';
import { debounceTime, Subject } from 'rxjs';
import { ProductService } from '@/pages/products/product.service';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DrawerModule } from 'primeng/drawer';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule,//AppConfigurator, 
    BadgeModule,FormsModule,InputTextModule,
    ButtonModule,DrawerModule,
        MenuModule, OverlayBadgeModule, ButtonModule, TooltipModule,AutoCompleteModule],
    template: `<div class="layout-topbar 
         bg-gradient-to-r from-[#f9e0bb] via-[#fce7d2] to-[#fff7ed] 
         shadow-md border-b border-[#e2b14c] text-[#8a5c1d]">
  <div class="layout-topbar-logo-container flex items-center">
    <!-- Menu button -->
    @if(isAdmin){<button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
      <i class="pi pi-bars text-orange-500"></i>
    </button>}@else{
      <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
      <i class="pi pi-filter text-orange-500"></i>
    </button>
    }

    <!-- Logo -->
    <a class="layout-topbar-logo ml-2" routerLink="/products">
      <!-- <img src="assets/images/logo.png" alt="ZFC" class="h-10" /> -->
      <span class="my-title">ZFC</span>
    </a>
  </div>

  <div class="layout-topbar-actions flex-1">
    <!-- <div class="layout-config-menu"> -->
        <!-- Dark Mode Toggle (Commented) -->
        <!--
        <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
            <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
        </button>
        -->

        <!-- Color Picker (Commented) -->
        <!-- 
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
        -->
    <!-- </div> -->

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
      <div class="flex flex-row items-center justify-end gap-2 flex-nowrap overflow-x-auto w-full">

        <!-- Messages (Commented) -->
        <!-- 
        <button type="button" class="layout-topbar-action raised flex items-center shrink-0">
          <i class="pi pi-inbox"></i>
          <span class="hidden sm:inline">Messages</span>
        </button> 
        -->
  <div class="sm:hidden">
  <button 
    class="layout-topbar-action relative flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-full shrink-0 " 
    (click)="showMobileSearch = true"
    pTooltip="Search"
    tooltipPosition="bottom"
  >
    <i class="pi pi-search text-xl text-orange-500"></i>
  </button>
</div>
        <!-- Search (hidden on mobile, full width below) -->
        <div class="hidden sm:block w-64">
          <p-autoComplete
            [(ngModel)]="searchQuery"
            [suggestions]="filteredProducts"
            (completeMethod)="filterProducts($event)"
            (ngModelChange)="onProductSelected($event)"
            field="name"
            [dropdown]="false"
            [minLength]="1"
            [forceSelection]="true"
            placeholder="Search it..."
            appendTo="body"
            optionLabel="name"
            class="w-full"
          >
            <ng-template let-product pTemplate="item">
              <div class="flex flex-col">
                <span class="font-bold">{{ product.name }}</span>
                <small class="text-gray-600">{{ product.category }} • {{ product.subCategory }} • {{product.genderCategory}}</small>
              </div>
            </ng-template>

            <ng-template let-product pTemplate="selectedItem">
              <span>{{ formatProduct(product) }}</span>
            </ng-template>
          </p-autoComplete>
        </div>

        <!-- Cart Button -->
        <button 
          type="button" 
          class="relative flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-full shrink-0" 
          style="width: 2.3rem; height: 2.3rem;" 
          (click)="viewCart()"
          pTooltip="View items in your bag" 
          tooltipPosition="top"
        > 
          <i class="cart-button pi pi-shopping-bag text-orange-500 text-xl"></i>
          @if(cartCount > 0) {
            <span class="absolute -top-0 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-lg flex items-center justify-center leading-none z-10">
              {{ cartCount }}
            </span>
          }
        </button>


        <!-- User Button -->
        <button 
          type="button" 
          class="flex items-center justify-center bg-orange-100 dark:bg-blue-400/10 rounded-full shrink-0" 
          style="width: 2.5rem; height: 2.5rem;" 
          (click)="drawerVisible = true"
          #menuButton
        >
          <i class="pi pi-user text-orange-500 text-xl"></i>
        </button>

        <!-- User Menu -->
       <p-drawer 
  [header]="'Hello ' + userName"
  [(visible)]="drawerVisible" 
  position="right"
  [baseZIndex]="1000"
>

  <ul class="p-0 m-0 list-none space-y-4">
    <ng-container *ngFor="let item of overlayMenuItems">
      
      <!-- Separator -->
      <li *ngIf="item.separator" class="border-t border-gray-300 my-2"></li>
      
      <!-- Menu Item -->
      @if(!item.separator){<li  (click)="item.command?.({ originalEvent: $event, item: item })" class="cursor-pointer flex items-center gap-2 hover:text-orange-500">
        <i [class]="item.icon"></i>
        <span>{{ item.label }}</span>
      </li>}

    </ng-container>
  </ul>
</p-drawer>
      </div>
    </div>
    <!-- END: Icons Always Visible -->

    
  </div>
</div>
<!-- Mobile Search Modal -->
@if (showMobileSearch) {
  <div class="fixed inset-0 bg-black/40 z-50 flex items-start justify-start px-4x mt-15">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-semibold">Search </h3>
        <p-button severity="contrast" rounded  outlined (click)="toggleMobileSearch()">
          <i class="pi pi-times text-lg"></i>
        </p-button>
      </div>

      <!-- Search Input -->
      <div class="relative mb-4">
        <i class="pi pi-search absolute top-3 left-3 text-gray-400"></i>
        <input 
          type="text"
          [(ngModel)]="searchQuery"
          (ngModelChange)="filterProducts({ query: $event })"
          placeholder="Search it..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
        />
      </div>

      <!-- Suggestions List -->
     @if(filteredProducts.length > 0){ <div  class="space-y-2 max-h-64 overflow-y-auto">
        @for (product of filteredProducts; track product.id) {
          <div 
            class="flex items-start gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition"
            (click)="onProductSelected(product)"
          >
            
            <div>
              <p class="font-medium text-gray-800">{{ product.name }}</p>
              <p class="text-sm text-gray-500">
                {{ product.category }} • {{ product.subCategory }} • {{ product.genderCategory }}
              </p>
            </div>
          </div>
        }
      </div>
      }
      <!-- Fallback -->
      @else {
        <p class="text-sm text-gray-500 text-center">No suggestions found.</p>
      }
    </div>
  </div>
}`
})


export class AppTopbar implements OnInit {

  drawerVisible: boolean = false;
  showMobileSearch = false;
  quickSearchTags: string[] = [];

    searchQuery: string | any='';
  filteredProducts: any[] = [];
  isAdmin=false;

  private searchSubject = new Subject<string>();
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
        if (localStorage.getItem("isLoggedIn") === "true") {
const roles = this.jwtHelper.getUserRoles(); // assuming this returns an array

  if (roles && roles.includes("ROLE_ADMIN")) {
    this.isAdmin=true;
  }
  this.getcart();
}

    }
     constructor(public layoutService: LayoutService, private cartService: CartService,private messageService:MessageService,
        private router: Router,private jwtHelper:JwtHelper,private productService:ProductService,private cd: ChangeDetectorRef) {
            // Debounce the search input to avoid spamming API calls
    this.searchSubject.pipe(debounceTime(300)).subscribe(query => {

        if (!query || query.trim().length === 0) {
      this.filteredProducts = [];
      return;
    }
      this.productService.getAutocompleteSuggestions(query).subscribe({
        next: (data:any) => {
          
          this.filteredProducts = [...data];
          this.filteredProducts.forEach(element => {
            this.quickSearchTags.push(element.name);
          });
          
          this.cd.markForCheck();
        },
        error: (err:any) => {
          this.filteredProducts = [];
        }
      });
    });

    }
onQuickTagClick(tag: string) {
  this.searchQuery = tag;
  this.searchSubject.next(tag); // triggers autocomplete suggestions
}

    filterProducts(event: any) {
    //const query = event.query;
    this.searchSubject.next(event.query);
  }

  formatProduct(product: any): string {
    return `${product.name} (${product.category} > ${product.subCategory}) - ${product.genderCategory}`;
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
            icon: 'pi pi-id-card',
        },{ separator: true },
        {
            label: 'My Orders',
            icon: 'pi pi-box', command: () => this.myOrders()
        },{ separator: true },
        {
            label: 'Wishlist',
            icon: 'pi pi-heart',command:()=>this.goTOWishList()
        },{ separator: true },
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
      this.messageService.add({
        key:'global',
        severity: 'warn',
        summary: 'You have been logged out successfully',
        detail: 'Come back soon..',
      });
        this.isLoggedIn = false;
        localStorage.setItem('isLoggedIn', "false");
this.drawerVisible=false;
        localStorage.removeItem('username');
       this.jwtHelper.logout();
       window.location.reload();
       this.router.navigate(['']);

    }
    myOrders(): void {
      this.drawerVisible=false;
    this.router.navigate(['/order/order-history']);
    
  }

   goTOWishList(): void {
      this.drawerVisible=false;
    this.router.navigate(['/wishlist']);
    
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

    onProductSelected(product: any) {
  this.router.navigate(['/products'], { queryParams: { search: product.name } });
  this.showMobileSearch = false;

}
onModelChange(value: any) {
  this.searchQuery = value;
}
toggleMobileSearch() {
  this.showMobileSearch = !this.showMobileSearch;

  // Show all suggestions immediately on open
  if (this.showMobileSearch) {
    this.searchSubject.next('');
  }
}

getcart(){
  this.cartService.getCart().subscribe({
    next: (res) => {
      this.cart = res;
      this.cartCount = this.cart.items.length;
    },
    error: (err) => {
      console.error('Failed to load cart', err);
    }
  });
}}