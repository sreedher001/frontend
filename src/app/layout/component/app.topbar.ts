import { ChangeDetectorRef, Component, HostListener, NgModule, OnInit } from '@angular/core';
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
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule, StyleClassModule, //AppConfigurator, 
    BadgeModule, FormsModule, InputTextModule,
    ButtonModule, DrawerModule,
    MenuModule, OverlayBadgeModule, ButtonModule, TooltipModule, AutoCompleteModule, Cart, AppConfigurator],
  template: `<div class="layout-topbar 
         
         shadow-md  text-[#8a5c1d]">
  <div class="layout-topbar-logo-container flex items-center">
    <!-- Menu button -->
    @if(isAdmin){<button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
      <i class="pi pi-bars "></i>
    </button>}@else{
      <!-- <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
      <i class="pi pi-filter text-orange-500"></i>
    </button> -->
    }

    <!-- Logo -->
    <a class="layout-topbar-logo ml-2" routerLink="/products">
      <!-- <img src="assets/images/logo.png" alt="ZFC" class="h-10" /> -->
      <span class="my-title">ZYRA</span>
    </a>
  </div>

  <div class="layout-topbar-actions flex-1 ">
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

        
  <div class="sm:hidden">
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
        
        <div class="hidden sm:block w-80">
  <p-autoComplete
    [(ngModel)]="searchQuery"
    [suggestions]="filteredProducts"
    (completeMethod)="filterProducts($event)"
    (onSelect)="onProductSelected($event)"
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


<p-drawer
  [(visible)]="visibleCartDrawer"
  position="right"
  header="My Cart"
  [style]="{ width: drawerWidth }"
>

  <!-- Full width timer -->
  <div class="-mx-4 bg-green-100 text-green-800 text-center text-md font-semibold py-3 ">
    ⏳ Sale ends in {{ displayTime }}
  </div>

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
    items: []

  };

  isLoggedIn: boolean = false;
  cartCount: number = 0;
  wishlistCount: number = 0;
  userName: any = '';
  overlayMenuItems: MenuItem[] = [];
  visibleCartDrawer=false;
  drawerWidth = '520px';
  cartItems: any[] = [];

   remainingTime: number = 0;
  displayTime: string = '';
  interval: any;
  ngOnInit(): void {
    
     this.cartService.drawerVisible$.subscribe(
    visible => this.visibleCartDrawer = visible
  );

  this.cartService.cart$.subscribe(cart => {
    this.cartItems = cart?.items || [];
    this.cd.detectChanges();
  });
  
    this.setUserMenuItem();
this.setDrawerWidth();
    if (localStorage.getItem("isLoggedIn") === "true") {
      this.isLoggedIn=true;
      this.cartService.getCart().subscribe(); // loads and updates BehaviorSubject
      // this.getWishList();

      // Keep the topbar badge live-updating
      this.cartService.cartCount$.subscribe((count: any) => {
        this.cartCount = count;
        this.cd.detectChanges();

        //this.productService.getWishlist().subscribe();
    this.productService.wishlistCount$.subscribe(count => {
      this.wishlistCount = count;
      this.cd.detectChanges();
    });
      });
    }
    if (localStorage.getItem("isLoggedIn") === "true") {
      const roles = this.jwtHelper.getUserRoles(); // assuming this returns an array

      if (roles && roles.includes("ROLE_ADMIN")) {
        this.isAdmin = true;
      }
    }



    const savedEndTime = localStorage.getItem('saleEndTime');

    if (savedEndTime) {
      this.remainingTime = +savedEndTime - Date.now();
    } else {
      // 1 hour timer
      const endTime = Date.now() + (60 * 60 * 3000);
      localStorage.setItem('saleEndTime', endTime.toString());
      this.remainingTime = 60 * 60 * 3000;
    }

    this.startTimer();

  }
  constructor(public layoutService: LayoutService, private cartService: CartService, private messageService: MessageService,private sanitizer: DomSanitizer,
    private router: Router, private jwtHelper: JwtHelper, private productService: ProductService, private cd: ChangeDetectorRef) {
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

   @HostListener('window:resize')
setDrawerWidth() {
  this.drawerWidth = window.innerWidth < 640 ? '99vw' : '520px';
}
  onQuickTagClick(tag: string) {
    this.searchQuery = tag;
    this.searchSubject.next(tag); // triggers autocomplete suggestions
  }

  // filterProducts(event: any) {
  //   //const query = event.query;
  //   this.searchSubject.next(event.query);
  // }

  startTimer() {
    this.interval = setInterval(() => {
      this.remainingTime -= 1000;

      if (this.remainingTime <= 0) {
        clearInterval(this.interval);
        this.displayTime = '00h : 00m : 00s';
        return;
      }

      this.displayTime = this.formatTime(this.remainingTime);
    }, 1000);
  }

  formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${this.pad(hours)}h : ${this.pad(minutes)}m : ${this.pad(seconds)}s`;
  }

  pad(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

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
  const genderPart = product.genderCategory
    ? `for ${product.genderCategory.toLowerCase()}`
    : '';

  const base =
    product.variantName ||
    product.subCategory ||
    product.productName ||
    'Product';

  const colorPart = product.color ? product.color.toLowerCase() : '';
  const fitPart = product.fit ? `${product.fit.toLowerCase()} fit` : '';
  const patternPart = product.pattern ? product.pattern.toLowerCase() : '';
  const stylePart = product.styleCategory
    ? `${product.styleCategory.toLowerCase()} style`
    : '';
  const occasionPart = product.occasion
    ? `${product.occasion.toLowerCase()} wear`
    : '';
  const seasonPart = product.season
    ? `${product.season.toLowerCase()} collection`
    : '';

  // Assemble the descriptive sentence
  const description = [
    colorPart,
    fitPart,
    patternPart,
    base.toLowerCase(),
    genderPart,
     stylePart
    // occasionPart,
    // seasonPart,
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Capitalize first letter for clean UI
  return description.charAt(0).toUpperCase() + description.slice(1);
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
  viewCart() {
    // this.router.navigate(['/cart']);
    this.visibleCartDrawer=true;

  }
  wishList() {
    this.router.navigate(['/wishlist']);
  }
  signup() {
    this.router.navigate(['/auth/signup']);
  }
  login() {
    this.router.navigate(['/auth/login']);
  }


  onProductSelected(event: any) {
  const product = event.value ? event.value : event; //  works for both mobile + desktop
  console.log("Selected product:", product);

  if (product && product.productName) {
    this.router.navigate(['/products'], { queryParams: { search: product.productName } });
    
    this.searchQuery = product.productName;
    this.showMobileSearch = false;
  }
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