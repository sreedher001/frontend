import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { JwtHelper } from '@/jwt/jwt-helper';
import { CheckboxModule } from 'primeng/checkbox';
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
interface FilterOptions {
  gender: string;
  categories: string[];
  colors: string[];
  styles: string[];
  seasons: string[];
  occasions: string[];
  isFeatured: boolean;
  minRating: number;
}


@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule,CheckboxModule,SliderModule,FormsModule],
    template: `
    @if(isAdmin){<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            @if(!item.separator){<li app-menuitem  [item]="item" [index]="i" [root]="true"></li>}
            @if(item.separator){<li class="menu-separator"></li>}
        </ng-container>
    </ul>} 
    <!-- Non-admin filter panel -->
@if(!isAdmin){
    <div class="space-y-6 p-4 text-sm">

  <!-- Gender Buttons -->
  <div>
    <h6 class="font-semibold mb-2">Gender</h6>
    <div class="flex gap-2 flex-wrap">
      <button
        *ngFor="let gender of genderOptions"
        (click)="filters.gender = gender"
        [ngClass]="{
          'bg-yellow-400 text-white': filters.gender === gender,
          'bg-gray-200': filters.gender !== gender
        }"
        class="px-3 py-1 rounded-full text-xs hover:bg-yellow-300"
      >
        {{ gender }}
      </button>
    </div>
  </div>

  

  <!-- Style Category -->
  <div>
    <h6 class="font-semibold mb-2">Style</h6>
    <div class="flex gap-2 flex-wrap">
      <button
        *ngFor="let style of styleOptions"
        (click)="toggleSelection(filters.styles, style)"
        [ngClass]="{
          'bg-yellow-500 text-white': filters.styles.includes(style),
          'bg-gray-100': !filters.styles.includes(style)
        }"
        class="px-3 py-1 rounded-full text-xs hover:bg-yellow-300"
      >
        {{ style }}
      </button>
    </div>
  </div>

  <!-- Action buttons -->
  <div class="pt-4 flex gap-2">
    <button class="p-button p-button-sm p-button-warn " (click)="applyFilters()">Apply</button>
    <button class="p-button p-button-sm p-button-warn p-button-outlined" (click)="resetFilters()">Reset</button>
  </div>

</div>

}`
})


export class AppMenu {
    model: MenuItem[] = [];
    constructor(private jwtHelper:JwtHelper){}
isAdmin=false;
filters: FilterOptions = {
  gender: '',
  categories: [],
  colors: [],
  styles: [],
  seasons: [],
  occasions: [],
  isFeatured: false,
  minRating: 0,
};


toggleSelection(list: string[], item: string): void {
  const index = list.indexOf(item);
  if (index === -1) {
    list.push(item);
  } else {
    list.splice(index, 1);
  }
}

genderOptions = [ 'Women', 'Kids'];
styleOptions = ['Casual Wear', 'Ethnic Wear'];

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
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/admin/dashboard'] },
                { label: 'Add New Product', icon: 'pi pi-fw pi-plus', routerLink: ['/admin/products/add'] },
                { label: 'Manage Products', icon: 'pi pi-fw pi-cog', routerLink: ['/admin/products/manageproducts'] },
                { label: 'Add New Variant', icon: 'pi pi-fw pi-plus', routerLink: ['/admin/products/addvariant'] },
                { label: 'Manage Orders', icon: 'pi pi-fw pi-cog', routerLink: ['/admin/orders'] },
                { label: 'Register Expense', icon: 'pi pi-receipt', routerLink: ['/admin/invoice'] },
                
                { label: 'View Expense', icon: 'pi pi-eye', routerLink: ['/admin/invoice-list'] },
                { label: 'Banners', icon: 'pi pi-image', routerLink: ['/admin/banner'] }

            ]
            },
            
        ];
        }
    }
    applyFilters() {
}
resetFilters() {
  this.filters = {
    gender: '',
    categories: [],
    colors: [],
    styles: [],
    seasons: [],
    occasions: [],
    isFeatured: false,
    minRating: 0,
  };

  this.applyFilters(); // optional - auto reapply
}

}
