import { Component, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { GalleriaModule } from 'primeng/galleria';
import { Products } from "../products/products";
import { Rating } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { ProductResponse } from '@/models/product-response.model';
import { ProductService } from '../products/product.service';
import { Product } from '@/models/product.model';
import { MessageService } from 'primeng/api';
import { CartService } from '../cart/cart.service';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CarouselModule } from 'primeng/carousel';
import { ProductVariantResponseDto } from '@/models/productVariantResponseDto';
import { LoginComponent } from "../auth/login";
import { Signup } from "../auth/signup/signup";
import { DialogModule } from 'primeng/dialog';
import { AccordionModule, AccordionPanel } from 'primeng/accordion';

interface RelatedItem {
  variantId:number;
  label: string; // Variant name
  image: string; // Front image URL
}
@Component({
  selector: 'app-productdetails',
  imports: [GalleriaModule,ButtonModule,AccordionPanel,AccordionModule,DialogModule, FormsModule, BadgeModule, TagModule, PanelMenuModule, CarouselModule, LoginComponent, Signup],
  templateUrl: './productdetails.html',
  styleUrl: './productdetails.scss'
})
@Injectable({
  providedIn: 'root' 
})
export class Productdetails implements OnInit {
viewSimilar(arg0: number) {
this.showStylePanel = !this.showStylePanel;
this.showSizeSelector=false;
}
relatedItems: RelatedItem[] = [];
productId!: number;
productResponse!:ProductResponse;
showSizeGuide: boolean = false;
unit: 'cm' | 'inch' = 'cm';
//  product: Product |null=null;
sizeGuideData = {
  cm: [
    { size: 'XS', chest: 86, waist: 71 },
    { size: 'S', chest: 91, waist: 76 },
    { size: 'M', chest: 97, waist: 81},
    { size: 'L', chest: 102, waist: 86 },
    { size: 'XL', chest: 107, waist: 91 },
    { size: 'XXL', chest: 112, waist: 96 }
  ],
  inch: [
    { size: 'XS', chest: 34, waist: 28 },
    { size: 'S', chest: 36, waist: 30 },
    { size: 'M', chest: 38, waist: 32 },
    { size: 'L', chest: 40, waist: 34 },
    { size: 'XL', chest: 42, waist: 36 },
    { size: 'XXL', chest: 44, waist: 38 }
  ]
};
product: Product = {
  id: 0,
  productId: '',
  name: '',
  description: '',
  genderCategory: '',
  category: '',
  subCategory: '',
  color: '',
  rating: 0,
  isFeatured: false,
  uploadedAt: null,
  variants: [],
  variant: {
    id: 0,
    variantName: '',
    color: '',
    styleCategory: '',
    fit: '',
    pattern: '',
    season: '',
    occasion: '',
    isFeatured: false,
    rating: 0,
    variantDescription: '',
    productImage: [],
    sizes: [],

    fabricType: '',
    materialComposition: '',
    liningMaterial: '',
    transparencyLevel: '',
    stretchability: '',
    workType: '',
    careInstructions: '',
    madeBy: '',
    sizeRecommendation: '',
    modelInfo: ''

  },
  sizes: []
};

  images: any[] = [];
 selectedSize: any | null = null;
isSizeSelected=false;
//hasRelatedItems=true;
loading=true;
showSizeSelector: boolean = false;
 isAdmin: boolean = false;
showSignupPanel = false;
showLogin = false;
isLoggedIn:boolean =false;
wishlistVariantIds: Set<number> = new Set(); // Store variant IDs in wishlist
wishlistItems: any[] = [];


  constructor(private route: ActivatedRoute,private productService: ProductService, private cartService: CartService,
    private messageService: MessageService,private router: Router) {}
  
  ngOnInit(): void {
    this.loading=true;
    this.route.paramMap.subscribe(params => {
    this.productId = Number(params.get('id'));
    this.getProductByVariantId(this.productId);
    this.fetchSimilarProducts(this.productId);

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
  });
  }

  isInWishlist(variant: any): boolean {
  return this.wishlistVariantIds.has(variant.id);
}
  fetchSimilarProducts(variantId:number) {
    this.productService.getSimilarProducts(variantId).subscribe({
      next: (data) => {
         const variants = data?.variants ?? [];
        this.relatedItems = variants?.map((variant:any) => {
          
  const frontImage = variant.productImage.find((img:any) => img.viewType === 'front');
  return {
    variantId:variant?.id,
    label: variant.variantName,
    image: frontImage?.imageUrl || variant.name  // fallback if no front image
  } as RelatedItem;
});
        
      },
      error: (err) => {
        console.error('Error fetching product:', err);
      }
    });
  }
  
  getRatingSeverity(rating: number): string {
  if (rating >= 4) return 'bg-white-100 text-green-500';      // high rating
  if (rating >= 3) return 'bg-white-100 text-yellow-500';     // medium rating
  return 'bg-white-100 text-red-500';                            // low rating
}
goToProductDetails(id: string) {
  this.showStylePanel = false;
  const currentId = this.route.snapshot.paramMap.get('id');
  if (currentId !== id) {
    this.router.navigate([`/product-details/${id}`]);
  }
}


hasUniformPrice(sizes: any[]): boolean {
  if (!sizes || sizes.length === 0) return true;
  const firstPrice = sizes[0].price;
  const firstDiscount = sizes[0].discountPercentage;
  return sizes.every(s =>
    s.price === firstPrice && s.discountPercentage === firstDiscount
  );
}

getDiscountedPrice(size: any): number {
  if (!size || size.discountPercentage === 0) return size.price;
  return Math.round(size.price - (size.price * size.discountPercentage / 100));
}



  selectSize(size: any) {
  if (size.availableQuantity > 0) {
    this.selectedSize = size;
  }
}
  getProductByVariantId(productId:number) {
    this.loading=true;
    

    this.productService.getProductByVariantId(productId).subscribe({
      next: (data) => {

      this.product = data;
      this.product.variant =data.variant;
      this.product.variant.variantName=data.variant.variantName;
      this.product.variant.sizes =data.variant.sizes?? [];
      this.product.variant.productImage=data.variant.productImage ?? [];
        this.images = this.product.variant.productImage.map((img: any) => ({
          itemImageSrc: img.imageUrl,
          thumbnailImageSrc: img.imageUrl,
          alt: this.product?.name,
        }));this.loading=false;
      },
      error: (err) => {
        console.error('Error fetching product:', err);
        this.loading=false;
      }
    });
  }

handleLoginSuccess($event:any) {
  this.isLoggedIn = true;
  this.showSignupPanel = false;

  // Refresh the current page
  window.location.reload();
}

  onImageLoad(event: Event) {
  const img = event.target as HTMLImageElement;
  img.classList.add('loaded');
}


   addToCart(variant: any,event: Event,navigateToCart: boolean = false): void {
    event.stopPropagation();

    if (!this.selectedSize || !this.selectedSize.id) {
      this.isSizeSelected=false;
    this.messageService.add({
      key: 'global',
      severity: 'info',
      summary: 'Select a Size',
      detail: 'Please select a size before adding to bag.'
    });
    return;
  }
  const payload: any = {
    variantId: variant.id,
    sizeId: this.selectedSize.id,
    color: variant.color,
    quantity: 1
  };
    const sizeId = this.selectedSize.id;
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

if (isLoggedIn) {
  // Logged-in: use backend
    this.cartService.addToCart({ variantId: variant.id,sizeId:sizeId,color:variant.color, quantity: 1 }).subscribe({
      next: () => {
        this.isSizeSelected=true;
        this.messageService.add({
          key: 'global',
          severity: 'info',
          summary: 'Added to your bag',
          detail: `${variant.variantName} was added successfully.`
        });
        //this.showStylePanel=true;
        if (navigateToCart) {
          this.router.navigate(['/cart']);
        }
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({
          key: 'global',
          severity: 'error',
          summary: 'Add Failed',
          detail: 'Could not add to cart. Please try again.'
        });
      }
    });
  }
    else {
    // Guest: Save in localStorage
    const guestCartKey = 'guestCart';
    const guestCart = JSON.parse(localStorage.getItem(guestCartKey) || '[]');

    const newItem = {
      ...payload,
      variantName: variant.variantName,
      size: this.selectedSize.size,
      price: this.selectedSize.price,
      discountPercentage: this.selectedSize.discountPercentage,
      imageUrl: variant.productImage?.[0]?.imageUrl || ''
    };

    // Check if already in guest cart
    const existing = guestCart.find((item: any) =>
      item.variantId === newItem.variantId &&
      item.sizeId === newItem.sizeId
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      guestCart.push(newItem);
    }
console.log("guestCart",guestCart);
    localStorage.setItem(guestCartKey, JSON.stringify(guestCart));

    this.messageService.add({
      key: 'global',
      severity: 'success',
      summary: 'Added to Bag',
      detail: `${variant.variantName} added. Login to checkout.`
    });

    this.showStylePanel = true;
    if (navigateToCart) {
      this.router.navigate(['/cart']);
    }
  }
  
  }

  

  buyNow(variant: any,event: Event): void {
   
  this.addToCart(variant,event,true);
  
  }

  responsiveOptions = [
    { breakpoint: '1024px', numVisible: 5 },
    { breakpoint: '768px', numVisible: 5 },
    { breakpoint: '560px', numVisible: 5 }
  ];

 showStylePanel = false;

toggleStylePanel() {
  this.showStylePanel = !this.showStylePanel;
  this.showSizeSelector = false;
}

openSizeSelector() {
  this.showSizeSelector = true;
  this.showStylePanel =false;
}

closeSizeSelector() {
  this.showSizeSelector = false;
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
getSizeGuide(unit: 'cm' | 'inch') {
  return this.sizeGuideData[unit];
}
}
