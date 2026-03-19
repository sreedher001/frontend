import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

import { ProductResponse } from '@/models/product-response.model';
import { ProductVariantResponseDto } from '@/models/productVariantResponseDto';
import { Banner, ProductService } from '../products/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelper } from '@/jwt/jwt-helper';
import { MessageService } from 'primeng/api';
import { Signup } from "../auth/signup/signup";
import { LoginComponent } from "../auth/login";
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { SliderModule } from 'primeng/slider';

@Component({
  selector: 'app-searchresult',
  imports: [CardModule, CommonModule,CheckboxModule, ButtonModule, FluidModule, TagModule, FormsModule, BadgeModule, Tooltip, CarouselModule,
    ChipModule, Signup, LoginComponent,RadioButtonModule,SliderModule],
  templateUrl: './searchresult.html',
  styleUrl: './searchresult.scss'
})
export class Searchresult implements OnInit{

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
gridView = 2;
showFilter = false;
filters: any[] = [];
activeFilter: any;
sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'New Arrival', value: 'new' },
  { label: 'Best Selling', value: 'bestselling' },
  { label: 'Price: Low to High', value: 'priceAsc' },
  { label: 'Price: High to Low', value: 'priceDesc' }
];

selectedSort = '';
selectedSortLabel = '';
banners: Banner[] = [];
showSort = false;
selectedFilters:any = {
  price: [0,10000]
};
    constructor(private productService: ProductService,private router: Router,private jwtHelper: JwtHelper,

    private messageService: MessageService,public route: ActivatedRoute
  ) { }
    ngOnInit(): void {
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

      
      this.route.paramMap.subscribe(params => {
    const style = params.get('style');
    this.getWearType(style);
  });
  this.filter();
    }
    getBanners() {
   this.productService.getAllBanners().subscribe({
      next: (data) => (this.banners = data),
      error: (err) => console.error('Failed to load banners:', err)
    });
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
    name: 'Color',
    key: 'color',
    type: 'checkbox',
    options: [
      { label: 'Black', value: 'black', code: '#000000' },
      { label: 'White', value: 'white', code: '#ffffff' },
      { label: 'Blue', value: 'blue', code: '#2563eb' },
      { label: 'Red', value: 'red', code: '#dc2626' },
      { label: 'Green', value: 'green', code: '#16a34a' },
      { label: 'Yellow', value: 'yellow', code: '#eab308' },
      { label: 'Pink', value: 'pink', code: '#ec4899' },
      { label: 'Purple', value: 'purple', code: '#7c3aed' },
      { label: 'Gray', value: 'gray', code: '#6b7280' },
      { label: 'Orange', value: 'orange', code: '#f97316' },
      { label: 'Brown', value: 'brown', code: '#a0522d' }
    ]
  },
  {
    name: 'Size',
    key: 'size',
    type: 'checkbox',
    options: [
      { label: 'S', value: 'S' },
      { label: 'M', value: 'M' },
      { label: 'L', value: 'L' },
      { label: 'XL', value: 'XL' },
      { label: 'XXL', value: 'XXL' },
      { label: 'XXXL', value: 'XXXL' },
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

  getWearType(style: string | null, append: boolean = false) {
  if (this.loading || this.lastPage) return;
  this.loading = true;

  this.productService.getWearType(style, this.page, this.size).subscribe({
    next: (res) => {
      this.productResponseDto = res;

      // only reset when it's the first page (fresh load)
      if (!append) {
        this.products = [];
      }

      this.products.push(...res.content);
      console.log('products===', this.products);

      this.lastPage = res.last;
      this.page++; // prepare for next page
      this.loading = false;
    },
    error: (err) => {
      console.error('Failed to fetch products', err);
      this.loading = false;
    }
  });
}

  onCardClick(product:Product,variant:ProductVariantResponseDto) {
  this.router.navigate(['/product-details',variant.id]);
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

getVariantFinalPrice(variant: any): number {
  const size = variant?.sizes?.[0];
  if (!size) return 0;
  return size.price - (size.price * (size.discountPercentage ?? 0)) / 100;
}

getVariantSavings(variant: any): string {
  const size = variant?.sizes?.[0];
  if (!size || !size.discountPercentage) return '';
  const discountAmount = (size.price * size.discountPercentage) / 100;
  return `Save ₹${discountAmount.toFixed(0)}`;
}

getBestSize(variant: any) {
  if (!variant?.sizes?.length) return null;
  return variant.sizes.reduce((prev:any, curr:any) =>
    curr.price < prev.price ? curr : prev
  );
}
hasDiscount(product: any): boolean {
  return !!product.variants?.[0]?.sizes?.[0]?.discountPercentage;
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

applyFilters(){

  const filterPayload = this.selectedFilters;

  console.log("Applied Filters:", filterPayload);

  // this.getWearType(
  //   this.route.snapshot.paramMap.get('style'),
  //   true,
  //   filterPayload
  // );

  // close filter panel if mobile
  this.showFilter = false;

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

applySort(option:any){

  this.selectedSort = option.value;
  this.selectedSortLabel = option.label;

  this.showSort = false;

  // reload products
  this.getWearType(
    this.route.snapshot.paramMap.get('style'),
    true
  );

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
