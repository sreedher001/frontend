import { ChangeDetectorRef, Component, HostListener, NgModule, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { BadgeModule } from 'primeng/badge';
import { CartService, PurchaseType } from '@/pages/cart/cart.service';
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
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { StoreSettingsService } from '@/store-settings/store-settings.service';
import { Category } from '@/pages/products/product.service';
import { ResolveImagePipe } from '@/shared/resolve-image.pipe';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule, StyleClassModule, //AppConfigurator, 
    BadgeModule, FormsModule, InputTextModule,
    ButtonModule, DrawerModule,
    MenuModule, OverlayBadgeModule, ButtonModule, TooltipModule, AutoCompleteModule, Cart, AppConfigurator, ResolveImagePipe],
  template: `<div class="layout-topbar 
         
         shadow-md  text-[#8a5c1d]">
  <div class="layout-topbar-logo-container flex items-center shrink-0">
    <!-- Menu button -->
    @if(isAdmin){<button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
      <i class="pi pi-bars "></i>
    </button>}@else{
      <button class="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 mr-2" (click)="mobileNavVisible = true">
        <i class="pi pi-bars text-xl"></i>
      </button>
    }

    <!-- Logo -->
    <a class="layout-topbar-logo ml-2 flex items-center gap-2 shrink-0" routerLink="/">
      @if(storeSettingsService.current.logoUrl && storeSettingsService.current.logoUrl !== 'assets/images/logo.png'){
      <img [src]="storeSettingsService.current.logoUrl | resolveImage" [alt]="storeSettingsService.current.storeName" class="w-[90px] h-[77px] object-contain shrink-0" />
      }
      <span class="hidden lg:inline text-lg font-semibold tracking-wide brand-font whitespace-nowrap">{{ storeSettingsService.current.storeName | uppercase }}</span>
    </a>

    <!-- Retail / Wholesale Mode Switcher (desktop) -->
    @if(!isAdmin){
    <div class="ml-3 hidden lg:flex items-center border border-gray-300 rounded-full overflow-hidden text-sm font-semibold shrink-0 whitespace-nowrap">
      <button
        class="px-3 min-[1300px]:px-5 py-2 transition-all duration-200 whitespace-nowrap"
        [class]="currentPurchaseType === 'RETAIL' ? 'bg-[var(--p-primary-color)] text-[var(--p-primary-contrast-color)]' : 'bg-white text-gray-600 hover:bg-gray-100'"
        (click)="switchMode('RETAIL')"
      >Retail</button>
      <button
        class="px-3 min-[1300px]:px-5 py-2 transition-all duration-200 whitespace-nowrap"
        [class]="currentPurchaseType === 'WHOLESALE' ? 'bg-[var(--p-primary-color)] text-[var(--p-primary-contrast-color)]' : 'bg-white text-gray-600 hover:bg-gray-100'"
        (click)="switchMode('WHOLESALE')"
      >Wholesale</button>
    </div>
    }
  </div>

  <!-- Retail / Wholesale Mode Switcher (mobile-only bar) -->
  @if(!isAdmin){
  <div class="lg:hidden fixed top-32 left-0 w-full z-[996] bg-white border-b border-gray-200 flex justify-center py-1.5 shadow-sm">
    <div class="flex items-center border border-gray-300 rounded-full overflow-hidden text-sm font-semibold">
      <button
        class="px-6 py-2 transition-all duration-200"
        [class]="currentPurchaseType === 'RETAIL' ? 'bg-[var(--p-primary-color)] text-[var(--p-primary-contrast-color)]' : 'bg-white text-gray-600'"
        (click)="switchMode('RETAIL')"
      >Retail</button>
      <button
        class="px-6 py-2 transition-all duration-200"
        [class]="currentPurchaseType === 'WHOLESALE' ? 'bg-[var(--p-primary-color)] text-[var(--p-primary-contrast-color)]' : 'bg-white text-gray-600'"
        (click)="switchMode('WHOLESALE')"
      >Wholesale</button>
    </div>
  </div>
  }

  @if(!isAdmin){
  <nav class="hidden lg:flex flex-1 items-center justify-center gap-0 min-[1300px]:gap-2 h-full">

    <a routerLink="/" routerLinkActive="bg-[var(--p-primary-color)] text-[var(--p-primary-contrast-color)] rounded-full"
      [routerLinkActiveOptions]="{ exact: true }"
      class="px-2 min-[1300px]:px-4 py-1.5 text-sm font-semibold tracking-wide uppercase whitespace-nowrap transition-colors duration-150 rounded-full hover:bg-gray-100 hover:text-[var(--p-primary-color)]">
      Home
    </a>

    <a routerLink="/home" fragment="about"
      class="px-2 min-[1300px]:px-4 py-1.5 text-sm font-semibold tracking-wide uppercase whitespace-nowrap transition-colors duration-150 rounded-full hover:bg-gray-100 hover:text-[var(--p-primary-color)]">
      About Us
    </a>

    <!-- Products + Mega Menu -->
    <div class="relative group h-full flex items-center">
      <button type="button"
        class="px-2 min-[1300px]:px-4 py-1.5 text-sm font-semibold tracking-wide uppercase whitespace-nowrap transition-colors duration-150 rounded-full hover:bg-gray-100 hover:text-[var(--p-primary-color)] flex items-center gap-1">
        Products
        <i class="pi pi-chevron-down text-[10px]"></i>
      </button>

      <div class="hidden group-hover:block absolute left-1/2 -translate-x-1/2 top-full z-[998]">
        <div class="w-64 bg-[var(--p-primary-color)] rounded-b-xl shadow-xl py-3 mt-0">

          <a routerLink="/search"
            class="block px-5 py-2 text-sm font-bold text-white cursor-pointer hover:text-[var(--p-primary-100)]">
            All Products
          </a>

          @if(topLevelCategories.length > 0){
          @for(top of topLevelCategories; track top.id) {
          <a (click)="goToCategory(top)"
            class="block px-5 py-2 text-sm font-bold text-white cursor-pointer hover:text-[var(--p-primary-100)]">
            {{ top.name }}
          </a>
          @if(getSubcategories(top.id).length > 0){
          @for(sub of getSubcategories(top.id); track sub.id) {
          <a (click)="goToCategory(sub)"
            class="block pl-8 pr-5 py-1.5 text-sm font-semibold text-white/90 cursor-pointer hover:text-[var(--p-primary-100)]">
            {{ sub.name }}
          </a>
          }
          }
          }
          } @else {
          <p class="text-sm text-white/80 text-center py-2">No categories yet</p>
          }

        </div>
      </div>
    </div>

    <a routerLink="/home" fragment="contact"
      class="px-2 min-[1300px]:px-4 py-1.5 text-sm font-semibold tracking-wide uppercase whitespace-nowrap transition-colors duration-150 rounded-full hover:bg-gray-100 hover:text-[var(--p-primary-color)]">
      Contact Us
    </a>

  </nav>
  }

  <div class="layout-topbar-actions">
    <div class="layout-config-menu ">
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
        </div>  -->
       
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
      <div class="flex flex-row items-center justify-end gap-2 flex-nowrap overflow-x-auto w-full">

        <!-- Messages (Commented) -->
        <!-- 
        <button type="button" class="layout-topbar-action raised flex items-center shrink-0">
          <i class="pi pi-inbox"></i>
          <span class="hidden sm:inline">Messages</span>
        </button> 
        -->

        
  <div class="lg:hidden">
  <button
    class="layout-topbar-action relative flex items-center justify-center  rounded-full shrink-0 "
    (click)="showMobileSearch = true"
    pTooltip="Search"
    tooltipPosition="bottom"
  >
    <i class="pi pi-search "></i>
  </button>
</div>
        <!-- Search (hidden on mobile, full width below) -->
        <!-- <div class="hidden sm:block w-64">
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
        </div> -->
        
        <div class="hidden lg:block lg:w-28 min-[1300px]:w-80">
  <p-autoComplete
    [(ngModel)]="searchQuery"
    [suggestions]="filteredProducts"
    (completeMethod)="filterProducts($event)"
    (onSelect)="onProductSelected($event)"
    (keyup.enter)="onSearchEnter()"
    [dropdown]="false"
    [minLength]="1"
    [forceSelection]="false"
    placeholder="Search it..."
    appendTo="body"
    class="w-full"
  >
    <ng-template let-product pTemplate="item">
      <div class="flex flex-col">
        <span class="font-semibold" [innerHTML]="highlightSearch(product, searchQuery)"></span>
        <small class="text-gray-600">{{ formatProduct(product) }}</small>
      </div>
    </ng-template>
    <ng-template let-product pTemplate="selectedItem">
      <span>{{ product.productName }}</span>
    </ng-template>
  </p-autoComplete>
</div>




        <!-- wishlist Button -->
        <button 
          type="button" 
          class="relative flex items-center justify-center  shrink-0" 
          style="width: 2.3rem; height: 2.3rem;" 
          (click)="wishList()"
          pTooltip="your wishList" 
          tooltipPosition="top"
        > 
           @if(wishlistCount > 0) {<i class="cart-button pi pi-heart-fill text-black  text-xl"></i>}
           @else{<i class="text-black pi pi-heart "></i>}
          @if(wishlistCount > 0) {
            <span class="absolute -top-0 -right-1 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-lg flex items-center justify-center leading-none z-10">
              {{ wishlistCount }}
            </span>
          }
        </button>

        <!-- Cart Button -->
        <button 
          type="button" 
          class="relative flex items-center justify-center  shrink-0" 
          style="width: 2.3rem; height: 2.3rem;" 
          (click)="viewCart()"
          pTooltip="View items in your bag" 
          tooltipPosition="top"
        > 
          <i class="cart-button pi pi-shopping-bag text-black text-xl"></i>
          @if(cartCount > 0) {
            <span class="absolute -top-0 -right-1 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-lg flex items-center justify-center leading-none z-10">
              {{ cartCount }}
            </span>
          }
        </button>


        <!-- User Button -->
        <button 
          type="button" 
          class="flex items-center justify-center rounded-full shrink-0" 
          style="width: 2.5rem; height: 2.5rem;" 
          (click)="drawerVisible = true"
          #menuButton
        >
          <i class="pi pi-user text-black text-xl"></i>
        </button>
<!-- Color Picker (Commented) -->
        
       <div class="">
            @if(isAdmin){<button
                class="layout-topbar-action layout-topbar-action-highlight"
                pStyleClass="@next"
                enterFromClass="hidden"
                enterActiveClass="animate-scalein"
                leaveToClass="hidden"
                leaveActiveClass="animate-fadeout"
                [hideOnOutsideClick]="true"
            >
                <i class="pi pi-palette"></i>
            </button>}
            <app-configurator />
        </div> 
        <!-- User Menu -->
       <p-drawer 
  [header]="'Hello ' + userName"
  [(visible)]="drawerVisible" 
  position="right"
  [baseZIndex]="1000"
>
 <!-- @if(isAdmin){<div class="relative">
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
        </div> } -->

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

@if(!isAdmin){
<p-drawer
  [(visible)]="mobileNavVisible"
  position="left"
  header="Menu"
  [style]="{ width: '280px' }">

  <div class="flex flex-col">

    <a routerLink="/" (click)="mobileNavVisible = false"
      class="px-2 py-3 text-sm font-semibold tracking-wide uppercase border-b border-gray-100">
      Home
    </a>

    <a routerLink="/home" fragment="about" (click)="mobileNavVisible = false"
      class="px-2 py-3 text-sm font-semibold tracking-wide uppercase border-b border-gray-100">
      About Us
    </a>

    <div class="border-b border-gray-100">
      <button type="button" (click)="mobileProductsExpanded = !mobileProductsExpanded"
        class="w-full flex items-center justify-between px-2 py-3 text-sm font-semibold tracking-wide uppercase">
        Products
        <i class="pi" [ngClass]="mobileProductsExpanded ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
      </button>
      @if(mobileProductsExpanded){
      <div class="pb-2">
        <a routerLink="/search" (click)="mobileNavVisible = false"
          class="block pl-4 pr-2 py-2 text-sm text-gray-700">
          All Products
        </a>
        @for(top of topLevelCategories; track top.id) {
        <a (click)="goToCategory(top); mobileNavVisible = false"
          class="block pl-4 pr-2 py-2 text-sm text-gray-700 cursor-pointer">
          {{ top.name }}
        </a>
        }
      </div>
      }
    </div>

    <a routerLink="/home" fragment="contact" (click)="mobileNavVisible = false"
      class="px-2 py-3 text-sm font-semibold tracking-wide uppercase border-b border-gray-100">
      Contact Us
    </a>

  </div>

</p-drawer>
}

<p-drawer
  [(visible)]="visibleCartDrawer"
  position="right"
  header="My Cart [{{ cartCount }}]"
  [style]="{ width: drawerWidth }">
  
  <app-cart></app-cart>

</p-drawer> 

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
          (keyup.enter)="onSearchEnter()"
          placeholder="Search it..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
        />
      </div>

      <!-- Suggestions List -->
     @if(filteredProducts.length > 0){ <div  class="space-y-2 max-h-64 overflow-y-auto">
        @for (product of filteredProducts; track product.id) {
          
         <div
  class="flex flex-col p-2 hover:bg-gray-100 rounded cursor-pointer"
  (click)="onProductSelected(product)"
>
  <span class="font-medium" [innerHTML]="highlightSearch(product, searchQuery)"></span>
  <small class="text-gray-500">{{ formatProduct(product) }}</small>
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
  mobileNavVisible: boolean = false;
  mobileProductsExpanded: boolean = false;
  showMobileSearch = false;
  quickSearchTags: string[] = [];

  searchQuery: string | any = '';
  filteredProducts: any[] = [];
  isAdmin = false;

  private searchSubject = new Subject<string>();
  items!: MenuItem[];
  cart: CartResponse = {
    cartId: 0,
    shippingFee: 0,
    totalAmount: 0,
    appliedPromotions: [],
      availableCoupons: [],
      lockedCoupons: [],
    items: [],
    purchaseType: 'RETAIL' as PurchaseType

  };

  isLoggedIn: boolean = false;
  cartCount: number = 0;
  wishlistCount: number = 0;
  userName: any = '';
  overlayMenuItems: MenuItem[] = [];
  visibleCartDrawer=false;
  drawerWidth = '400px';
  cartItems: any[] = [];
  currentPurchaseType: PurchaseType = 'RETAIL';

   remainingTime: number = 0;
  displayTime: string = '';
  interval: any;
  categories: Category[] = [];
  get topLevelCategories(): Category[] {
    return this.categories.filter(c => c.parentId == null);
  }
  getSubcategories(parentId: number): Category[] {
    return this.categories.filter(c => c.parentId === parentId);
  }
  goToCategory(category: Category) {
    this.router.navigate(['/search'], { queryParams: { categoryName: category.name } });
  }
  constructor(public layoutService: LayoutService, private cartService: CartService, private messageService: MessageService,private sanitizer: DomSanitizer,
    private router: Router, private jwtHelper: JwtHelper, private productService: ProductService, private cd: ChangeDetectorRef,
    public storeSettingsService: StoreSettingsService) {
    // Debounce the search input to avoid spamming API calls
    this.searchSubject.pipe(debounceTime(300)).subscribe(query => {

      // if (!query || query.trim().length === 0) {
      //   this.filteredProducts = [];
      //   return;
      // }
      this.productService.getAutocompleteSuggestions(query).subscribe({
        next: (data: any) => {

          this.filteredProducts = [...data];
          this.filteredProducts.forEach(element => {
            this.quickSearchTags.push(element.name);
          });

          this.cd.markForCheck();
        },
        error: (err: any) => {
          this.filteredProducts = [];
        }
      });
    });

  }
  ngOnInit(): void {
    
     this.cartService.drawerVisible$.subscribe(
    visible => this.visibleCartDrawer = visible
  );

  this.cartService.cart$.subscribe(cart => {
    this.cartItems = cart?.items || [];
    this.cd.detectChanges();
  });

  this.currentPurchaseType = this.cartService.getPurchaseType();

    this.setUserMenuItem();
this.setDrawerWidth();

    this.productService.getAllCategories().subscribe({
      next: (cats) => this.categories = cats,
      error: () => this.categories = []
    });
    if (localStorage.getItem("isLoggedIn") === "true") {
      this.isLoggedIn=true;
      this.cartService.getCart().subscribe(); // loads and updates BehaviorSubject
     

      this.productService.wishlistCount$.subscribe(count => {
      this.wishlistCount = count;
      this.cd.detectChanges();
    });
      // Keep the topbar badge live-updating
     
      
    }
     this.cartService.cartCount$.subscribe((count: any) => {
        this.cartCount = count;
        this.cd.detectChanges();
    
      });
    
    if (localStorage.getItem("isLoggedIn") === "true") {
      const roles = this.jwtHelper.getUserRoles(); // assuming this returns an array

      if (roles && roles.includes("ROLE_ADMIN")) {
        this.isAdmin = true;
        this.layoutService.layoutState.update((prev) => ({ ...prev, staticMenuDesktopInactive: false }));
      }
    }



   

  }
  

   @HostListener('window:resize')
setDrawerWidth() {
  this.drawerWidth = window.innerWidth < 640 ? '100vw' : '520px';
}
  onQuickTagClick(tag: string) {
    this.searchQuery = tag;
    this.searchSubject.next(tag); // triggers autocomplete suggestions
  }

  // filterProducts(event: any) {
  //   //const query = event.query;
  //   this.searchSubject.next(event.query);
  // }

  

  filterProducts(event: any) {
  const query = event.query.trim().toLowerCase();
  this.productService.getAutocompleteSuggestions(query).subscribe((data: any[]) => {
    // Prioritize results where query appears earlier or in variantName/color
    this.filteredProducts = data.sort((a, b) => {
      const aStr = JSON.stringify(a).toLowerCase();
      const bStr = JSON.stringify(b).toLowerCase();

      const aIndex = aStr.indexOf(query);
      const bIndex = bStr.indexOf(query);

      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  });
}


  // formatProduct(product: any): string {
  //   return `${product.name} (${product.category} > ${product.subCategory}) - ${product.genderCategory}`;
  // }

//   formatProduct(product: any): string {
//   const parts = [
//     product.category,
//     product.subCategory,
//     product.genderCategory,
//     product.color ? `Color: ${product.color}` : null,
//     product.fit ? `Fit: ${product.fit}` : null,
//     product.pattern ? `Pattern: ${product.pattern}` : null,
//     product.styleCategory ? `Style: ${product.styleCategory}` : null,
//   ].filter(Boolean);

//   return parts.join(" • ");
// }

formatProduct(product: any): string {
  const category = product.category || '';
  const variant = product.variantName || '';
  const weight = product.weight ? `${product.weight}${product.unit || ''}` : '';
  const brand = product.brand || '';

  const parts = [category, variant, weight, brand].filter(Boolean);
  if (parts.length === 0) return 'Product';
  const desc = parts.join(' - ');
  return desc.charAt(0).toUpperCase() + desc.slice(1);
} 

highlightSearch(product: any, query: string): SafeHtml {
  if (!product?.productName || !query) return product?.productName ?? '';

  const regex = new RegExp(`(${query})`, 'gi');
  const highlighted = product.productName.replace(regex, '<strong style="color:#D4AF37;">$1</strong>');

  // Mark as safe HTML so Angular renders it
  return this.sanitizer.bypassSecurityTrustHtml(highlighted);
}


  setUserMenuItem() {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn === "true") {
      this.isLoggedIn = true;
      const name = localStorage.getItem('userName') ? localStorage.getItem('userName') : "";
      this.userName = name;

      this.overlayMenuItems = [
        { label: 'Hello, ' + this.userName, icon: 'pi pi-user' },
        { separator: true },
        {
          label: 'My Profile',
          icon: 'pi pi-id-card', command: () => this.myProfile()
        }, { separator: true },
        {
          label: 'My Orders',
          icon: 'pi pi-box', command: () => this.myOrders()
        }, { separator: true },
        {
          label: 'Wishlist',
          icon: 'pi pi-heart', command: () => this.goTOWishList()
        }, { separator: true },


        { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() }
      ];
    }
    else {
      this.overlayMenuItems = [
        { label: 'Login', icon: 'pi pi-sign-in', command: () => this.login() },
        { label: 'Sign Up', icon: 'pi pi-user-plus', command: () => this.signup() }
      ];
    }
  }


  logout() {
    this.messageService.add({
      key: 'global',
      severity: 'warn',
      summary: 'You have been logged out successfully',
      detail: 'Come back soon..',
    });

    localStorage.clear();
    sessionStorage.clear();
    this.jwtHelper.logout();
    this.drawerVisible = false;
    this.isLoggedIn = false;

    // Navigate first, then full reload
    this.router.navigate(['']).then(() => {
      setTimeout(() => {
        window.location.href = '/'; // refresh at root (cleaner than reload)
      }, 300);
    });
  }


  myOrders(): void {
    this.drawerVisible = false;
    this.router.navigate(['/order/order-history']);

  }
  myProfile() {
    this.drawerVisible = false;
    this.router.navigate(['/myprofile']);
  }

  goTOWishList(): void {
    this.drawerVisible = false;
    this.router.navigate(['/wishlist']);

  }

  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }

  switchMode(type: PurchaseType) {
    if (type === this.currentPurchaseType) return;
    this.cartService.switchPurchaseType(type).subscribe({
      next: () => {
        this.currentPurchaseType = type;
        this.messageService.add({
          key: 'global', severity: 'info', summary: 'Mode Switched',
          detail: `Switched to ${type.toLowerCase()} mode`
        });
      },
      error: (err: any) => {
        this.messageService.add({
          key: 'global', severity: 'error', summary: 'Switch Failed',
          detail: err.error?.message || 'Cannot switch mode with items in cart. Please clear your cart first.'
        });
      }
    });
  }

  viewCart() {
    // this.router.navigate(['/cart']);
    this.cartService.openDrawer();

  }
  wishList() {
    this.router.navigate(['/wishlist']);
  }
  signup() {
    this.router.navigate(['/auth/signup']);
  }
  login() {
    this.router.navigate(['/auth/signin']);
  }


  onProductSelected(event: any) {
  const product = event.value ? event.value : event; //  works for both mobile + desktop
  console.log("Selected product:", product);

  if (product && product.productName) {
    this.router.navigate(['/search'], { queryParams: { search: product.productName } });

    this.searchQuery = product.productName;
    this.showMobileSearch = false;
  }
}

  onModelChange(value: any) {
    this.searchQuery = value;
  }

  onSearchEnter() {
    const query = typeof this.searchQuery === 'string' ? this.searchQuery.trim() : '';
    if (!query) return;

    this.router.navigate(['/search'], { queryParams: { search: query } });
    this.showMobileSearch = false;
  }
  toggleMobileSearch() {
    this.showMobileSearch = !this.showMobileSearch;

    // Show all suggestions immediately on open
    if (this.showMobileSearch) {
      this.searchSubject.next('');
    }
  }

  getcart() {
    this.cartService.getCart().subscribe({
      next: (res) => {
        this.cart = res;
        this.cartCount = this.cart.items.length;
      },
      error: (err) => {
        console.error('Failed to load cart', err);
      }
    });
  }

  getWishList() {
    this.productService.getWishlist().subscribe({
      next: (items: any[]) => {
        this.wishlistCount = items.length;
      },
      error: (err) => {
        console.error('Failed to load wishlist', err);
      }
    });
  }
}