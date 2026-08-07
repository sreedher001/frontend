import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { ChipModule } from 'primeng/chip';
import { FluidModule } from 'primeng/fluid';
import { TagModule } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { Product } from '@/models/product.model';
import { combineLatest } from 'rxjs';
import { ProductResponse } from '@/models/product-response.model';
import { ProductVariantResponseDto } from '@/models/productVariantResponseDto';
import { Banner, ProductService } from '../products/product.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { JwtHelper } from '@/jwt/jwt-helper';
import { MessageService } from 'primeng/api';
import { Signup } from "../auth/signup/signup";
import { LoginComponent } from "../auth/login";
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { SliderModule } from 'primeng/slider';
import { SeoService } from '@/seo/seo.service';
import { StoreSettingsService } from '@/store-settings/store-settings.service';
import { ResolveImagePipe } from '@/shared/resolve-image.pipe';
import { CartService, PurchaseType } from '../cart/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-searchresult',
  imports: [CardModule, CommonModule,CheckboxModule, ButtonModule, FluidModule, TagModule, FormsModule, BadgeModule, CarouselModule,
    ChipModule, Signup, LoginComponent,RadioButtonModule,SliderModule,ResolveImagePipe, RouterModule],
  templateUrl: './searchresult.html',
  styleUrl: './searchresult.scss'
})
export class Searchresult implements OnInit, OnDestroy {

  purchaseType: PurchaseType = 'RETAIL';
  private purchaseTypeSub!: Subscription;

  products: Product[] = [];
    productResponseDto!:ProductResponse;
    loading: boolean = false;
    page: number = 0;
size: number = 10;
lastPage: boolean = false;
showSignupPanel = false;
isLoggedIn:boolean =false;
showLogin = false;
wishlistVariantIds: Set<number> = new Set(); // Store variant IDs in wishlist
wishlistItems: any[] = [];
isAdmin: boolean = false;
gridView = 1;
showFilter = false;
filters: any[] = [];
activeFilter: any;
sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'New Arrival', value: 'new' },
  { label: 'Best Selling', value: 'bestselling' },
  { label: 'Price: Low to High', value: 'priceLowHigh' },
  { label: 'Price: High to Low', value: 'priceHighLow' }
];

selectedSort = '';
selectedSortLabel = '';
banners: Banner[] = [];
categoryOptions: { label: string; value: string }[] = [];

  get visibleBanners(): Banner[] {
    const mode = this.isWholesaleMode ? 'WHOLESALE' : 'RETAIL';
    return this.banners.filter(b => (b.purchaseType || 'BOTH') === 'BOTH' || b.purchaseType === mode);
  }
showSort = false;
selectedFilters:any = {
  price: [0,10000],
  categoryName: [],
  availability: null
};
searchPayload: any = {
  filters: {
    categoryName: []
  },
  query: null,
  minPrice: 0,
  maxPrice: 10000,
  inStock: null,
  sort: '',
  page: 0,
  size: 20
};
prods: any[] = [];
urlFilters: any = {};
    constructor(private productService: ProductService,private router: Router,private jwtHelper: JwtHelper,

    private messageService: MessageService,public route: ActivatedRoute,
    private seoService: SeoService, private cartService: CartService, private storeSettingsService: StoreSettingsService
  ) { }
    ngOnInit(): void {

this.seoService.update({
  title: 'Search Results',
  description: `Search products at ${this.storeSettingsService.current.storeName}.`
});

this.purchaseTypeSub = this.cartService.purchaseType$.subscribe(type => {
  this.purchaseType = type;
});

this.route.queryParamMap.subscribe(paramMap => {

  this.urlFilters = {};
  this.searchPayload.query = null;

  paramMap.keys.forEach(key => {

    const value = paramMap.get(key);
    if (!value) return;

    if (key === 'search') {
      this.searchPayload.query = value;
    } else {
      this.urlFilters[key] = value.split(',');
    }

  });

  this.buildPayload();

  this.searchProducts();
  this.updateGridView();
});


      this.getBanners();
      const roles = this.jwtHelper.getUserRoles();
  if (roles.includes('ROLE_ADMIN')) {
    this.isAdmin=true;
  }

      if(localStorage.getItem("isLoggedIn")==="true"){
      this.isLoggedIn=true;}
    
    if(localStorage.getItem("isLoggedIn")==="true"){
      this.isLoggedIn=true;
    this.productService.getWishlist().subscribe({
    next: (items: any[]) => {
      this.wishlistItems = items;
      this.wishlistVariantIds = new Set(items.map(i => i.variantId));
    },
    error: (err) => {
      console.error('Failed to load wishlist', err);
    }
  });
}

  this.productService.getAllCategories().subscribe({
    next: (cats) => {
      this.categoryOptions = cats.map(c => ({ label: c.name, value: c.name }));
      this.filter();
    },
    error: () => {
      this.categoryOptions = [];
      this.filter();
    }
  });
    }
    updateGridView() {
  this.gridView = window.innerWidth >= 1024 ? 4 : 1;
}
@HostListener('window:resize')
onResize() {
  this.updateGridView();
}
    
    buildPayload() {

  // reset filters
  this.searchPayload.filters = {
    categoryName: []
  };

  // apply URL filters
  Object.keys(this.urlFilters).forEach(key => {
    if (this.searchPayload.filters.hasOwnProperty(key)) {
      this.searchPayload.filters[key] = this.urlFilters[key];
    }
  });

  // apply UI filters
  if (this.selectedFilters.categoryName?.length) {
    this.searchPayload.filters.categoryName = this.selectedFilters.categoryName;
  }

  this.searchPayload.inStock =
    this.selectedFilters.availability === 'in_stock' ? true :
    this.selectedFilters.availability === 'out_stock' ? false :
    null;

}
applyFilters() {
  if (this.selectedFilters.price) {
    this.searchPayload.minPrice = this.selectedFilters.price[0];
    this.searchPayload.maxPrice = this.selectedFilters.price[1];
  }

  this.buildPayload();
this.searchProducts();
  this.lastPage = false;


  this.showFilter = false;
}
loadMore() {
  this.searchProducts(true);
}

searchProducts(append: boolean = false) {

  console.log('Executing search with payload:', this.searchPayload);

  if (!append) {
    this.prods = [];
    this.searchPayload.page = 0;
    this.lastPage = false;
  }

  if (this.loading) return;

  this.loading = true;

  this.productService.searchProducts(this.searchPayload).subscribe({
    next: (res: any) => {

      if (append) {
        this.prods.push(...res.content);
      } else {
        this.prods = res.content;
      }

      this.lastPage = res.last;
      this.searchPayload.page++;

      this.loading = false;
    },
    error: (err:any) => {
      console.error(err);
      this.loading = false;
    }
  });

}


    getBanners() {
   this.productService.getAllBanners().subscribe({
      next: (data) => (this.banners = data),
      error: (err) => console.error('Failed to load banners:', err)
    });
  }

  ngOnDestroy(): void {
    this.purchaseTypeSub?.unsubscribe();
  }

  get isWholesaleMode(): boolean {
    return this.purchaseType === 'WHOLESALE';
  }

  get breadcrumbLabel(): string {
    const params = this.route.snapshot.queryParamMap;
    return params.get('search') || params.get('categoryName') || 'All Products';
  }

  isWholesaleAvailable(item: any): boolean {
    return !!item?.wholesalePrice;
  }

  /** Hides Wholesale Only items while browsing in Retail mode and vice
   * versa, since search results come from a flat index that includes both. */
  get visibleProds(): any[] {
    if (this.isWholesaleMode) {
      return this.prods.filter(p => !!p.wholesaleEnabled);
    }
    return this.prods.filter(p => p.retailEnabled !== false);
  }

  getDisplayPrice(item: any): number {
    if (this.isWholesaleMode && this.isWholesaleAvailable(item)) {
      return item.wholesalePrice;
    }
    return item.retailPrice;
  }

  hasDiscount(item: any): boolean {
    return !!item?.mrp && item.mrp > item.retailPrice;
  }

  discountPercent(item: any): number {
    if (!this.hasDiscount(item)) return 0;
    return Math.round(((item.mrp - item.retailPrice) / item.mrp) * 100);
  }

  discountAmount(item: any): number {
    if (!this.hasDiscount(item)) return 0;
    return Math.round(item.mrp - item.retailPrice);
  }
  filter() {
    this.filters = [
  {
    name: 'Price',
    key: 'price',
    type: 'range',
    min: 0,
  max: 10000,
    options: [
      { label: 'Less than ₹500', value: '0-500' },
      { label: '₹500 - ₹1000', value: '500-1000' },
      { label: '₹1000 - ₹1500', value: '1000-1500' }
    ]
  },
  {
    name: 'Availability',
    key: 'availability',
    type: 'radio',
    options: [
      { label: 'In Stock', value: 'in_stock' },
      { label: 'Out of Stock', value: 'out_stock' }
    ]
  },
  {
    name: 'Product Type',
    key: 'categoryName',
    type: 'checkbox',
    options: this.categoryOptions
  }
];
this.activeFilter = this.filters[0]; // default to first filter
  }
  toggleColor(key:string,value:string){

  if(!this.selectedFilters[key]){
    this.selectedFilters[key] = [];
  }

  const index = this.selectedFilters[key].indexOf(value);

  if(index > -1){
    this.selectedFilters[key].splice(index,1);
  } else{
    this.selectedFilters[key].push(value);
  }

}
getFilterSummary(): string {

  const activeCategories: string[] = [];

  for (const key in this.selectedFilters) {

    const value = this.selectedFilters[key];
    const filter = this.filters.find(f => f.key === key);

    if (!filter) continue;

    if (Array.isArray(value)) {

      if (key === 'price') {

        if (value[0] !== filter.min || value[1] !== filter.max) {
          activeCategories.push(filter.name);
        }

      } else if (value.length) {

        activeCategories.push(filter.name);

      }

    } else if (value) {

      activeCategories.push(filter.name);

    }

  }

  if (!activeCategories.length) return '';

  const first = activeCategories[0];
  const second = activeCategories[1];
  const remaining = activeCategories.length - 1;

  return remaining > 0 ? `${first} ,${second}+ ${remaining}` : first;

}
  //  getWearType(style: string | null) {
  //   this.products=[];
  //   this.loading = true;
  //   this.productService.getWearType(style, 0, 20).subscribe(res => {
  //     this.productResponseDto = res;
  //     this.products.push(...res.content);
  //    console.log("products===",this.products);
      
  //     this.lastPage = res.last; // comes from Spring Data Page
  //     this.page++; // increment for next call
  //     this.loading = false;
  //   });
  // }
 getcollection(style: string | null) {
    if (this.loading || this.lastPage) return;
  this.loading = true;


  }
  onCardClick(item:any){
  this.router.navigate(['/product-details', item.variantSlug || item.variantId]);
}
isInWishlist(variant: any): boolean {
  return this.wishlistVariantIds.has(variant.id);
}


  toggleWishlist(variant: any, event: MouseEvent): void {
  event.stopPropagation(); // prevent card click

  if(this.isLoggedIn){
  const variantId = variant.id;

  if (this.isInWishlist(variant)) {
    // If already in wishlist → remove
    this.productService.removeFromWishlist(variantId).subscribe({
      next: () => {
        this.wishlistVariantIds.delete(variantId);
      },
      error: () => {
        // Optionally show error toast
      }
    });
  } else {
    // If not in wishlist → add
    this.productService.addToWishlist(variantId).subscribe({
      next: () => {
        this.wishlistVariantIds.add(variantId);
      },
      error: () => {
        // Optionally show error toast
      }
    });
  }
}else{
  this.showSignupPanel=true;
}
}
toggleSignupPanel() {
  this.showSignupPanel = !this.showSignupPanel;

  // Optional: reset to signup when panel opens
  if (this.showSignupPanel) {
    this.showLogin = false;
  }
}
toggleLogin() {
  this.showLogin = !this.showLogin;
}
handleLoginSuccess($event:any) {
  this.isLoggedIn = true;
  this.showSignupPanel = false;

  // Refresh the current page
  window.location.reload();
}
getFrontImage(product: Product): string {
    if (!product.variants || product.variants.length === 0) {
      return 'assets/no-image.png'; // fallback image
    }

    // Loop through variants → find first front image
    for (let variant of product.variants) {
      if (variant.productImage && variant.productImage.length > 0) {
        const frontImg = variant.productImage.find(img => img.viewType === 'front');
        if (frontImg) {
          return frontImg.imageUrl; // return the front image URL
        }
      }
    }

    return 'assets/no-image.png'; // fallback if no front image found
  }

  
getVariantFrontImage(variant: any): string {
  const frontImage = variant.productImage?.find((img: any) => img.viewType === 'front');
  return frontImage?.imageUrl || 'assets/placeholder.jpg';
}

editProduct(variant: any,event: MouseEvent) {
  event.stopPropagation();
  this.router.navigate(
    ['/admin/products/edit'],
    { queryParams: { variantId: variant.id, mode: 'edit' } }
  );
}

deleteProduct(variant: any,event: MouseEvent) {
  event.stopPropagation();
 this.router.navigate(
    ['/admin/products/edit'],
    { queryParams: { variantId: variant.id, mode: 'edit' } }
  );
}
getDeliveryDate(): string {
  const today = new Date();
  today.setDate(today.getDate() + 7); // e.g., 7 days from now
  return today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

openFilter(){
  this.showFilter = true;
}

closeFilter(){
  this.showFilter = false;
}
setFilterCategory(filter:any){
  this.activeFilter = filter;
}
getFilterCount(filter:any){

  const selected = this.selectedFilters[filter.key];

  if(!selected) return 0;

  if(Array.isArray(selected)){
    return selected.length;
  }

  return 1; // radio selected
}
updateFilter(){
  this.selectedFilters = { ...this.selectedFilters };
}


clearAllFilters(){

  this.selectedFilters = {};

  // optional: reset radio selections visually
  this.filters.forEach((f:any)=>{
    if(this.selectedFilters[f.key]){
      delete this.selectedFilters[f.key];
    }
  });

}
getSelectedLabels(filter:any){

  const selected = this.selectedFilters[filter.key];

  if(!selected) return [];

  if(Array.isArray(selected)){
    return filter.options
      .filter((o:any)=> selected.includes(o.value))
      .map((o:any)=> o.label);
  }

  const option = filter.options.find((o:any)=> o.value === selected);

  return option ? [option.label] : [];

  
}
removeFilter(filter:any, label:string){

  const option = filter.options.find((o:any)=> o.label === label);

  if(!option) return;

  const selected = this.selectedFilters[filter.key];

  if(Array.isArray(selected)){

    this.selectedFilters[filter.key] =
      selected.filter((v:any)=> v !== option.value);

    if(this.selectedFilters[filter.key].length === 0){
      delete this.selectedFilters[filter.key];
    }

  } else {

    delete this.selectedFilters[filter.key];

  }

  // force UI refresh
  this.selectedFilters = { ...this.selectedFilters };

}
openSort(){
  this.showSort = true;
}

closeSort(){
  this.showSort = false;
}

applySort(option: any) {

  this.selectedSort = option.value;
  this.selectedSortLabel = option.label;

  this.showSort = false;

  // update payload sort
  this.searchPayload.sort = option.value;

  // reset pagination
  this.searchPayload.page = 0;
  this.lastPage = false;
  this.prods = [];

  // call API again with same filters + new sort
  this.searchProducts();
}

toggleGrid() {
  if (this.gridView === 1) {
    this.gridView = 2;
  } else if (this.gridView === 2) {
    this.gridView = 4;
  } else {
    this.gridView = 1;
  }
}
}
