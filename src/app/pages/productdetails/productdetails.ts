import { ChangeDetectorRef, Component, ElementRef, HostListener, Injectable, OnInit, ViewChild } from '@angular/core';
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
import { ReviewService } from '../productreview/review-service';
import { JwtHelper } from '@/jwt/jwt-helper';
import { InputTextModule } from 'primeng/inputtext';
import { ImageModule } from 'primeng/image';
import { SeoService } from '@/seo/seo.service';
import { StoreSettingsService } from '@/store-settings/store-settings.service';
import { CommonService } from '@/layout/service/common';

interface RelatedItem {
  variantId:number;
  slug?: string;
  label: string; // Variant name
  image: string; // Front image URL
}
@Component({
  selector: 'app-productdetails',
  imports: [GalleriaModule,ImageModule, ButtonModule, InputTextModule, AccordionPanel, AccordionModule, DialogModule, FormsModule, BadgeModule, TagModule, PanelMenuModule, CarouselModule, LoginComponent, Signup],
  templateUrl: './productdetails.html',
  styleUrl: './productdetails.scss'
})
@Injectable({
  providedIn: 'root' 
})
export class Productdetails implements OnInit {
@ViewChild('carousel') carousel!: ElementRef;

viewSimilar(arg0: number) {
this.showStylePanel = !this.showStylePanel;
this.showSizeSelector=false;
}
relatedItems: RelatedItem[] = [];
productId!: number;
productResponse!:ProductResponse;
//  product: Product |null=null;
product: Product = {
  id: 0,
  productId: '',
  name: '',
  slug: '',
  shortDescription: '',
  longDescription: '',
  categoryId: 0,
  categoryName: '',
  subCategoryId: 0,
  subCategoryName: '',
  brand: '',
  sku: '',
  barcode: '',
  active: false,
  isFeatured: false,
  thumbnail: '',
  seoTitle: '',
  seoDescription: '',
  tags: '',
  sortOrder: 0,
  rating: 0,
  uploadedAt: null,
  variants: [],
  variant: {
    id: 0,
    variantName: '',
    weight: '',
    unit: '',
    sku: '',
    barcode: '',
    retailPrice: 0,
    wholesalePrice: 0,
    wholesaleEnabled: false,
    minWholesaleQuantity: 0,
    wholesaleDiscount: 0,
    active: false,
    sortOrder: 0,
    imageUrl: '',
    isFeatured: false,
    rating: 0,
    totalReviews: 0,
    productImage: [],
    availableQuantity: 0,
    inventoryStatus: ''
  },
  productImages: []
};

  images: any[] = [];

//hasRelatedItems=true;
loading=true;
showSizeSelector: boolean = false;
 isAdmin: boolean = false;
showSignupPanel = false;
showFloatingCta = false;
showLogin = false;
isLoggedIn:boolean =false;
wishlistVariantIds: Set<number> = new Set(); // Store variant IDs in wishlist
wishlistItems: any[] = [];
reviews: any[] = [];
reviewSummary: any;
showReviews = false;
ratingRows: any[] = [];
thumbnailPosition: any;
activeIndex = 0;
fullscreen = false;
page = 0;
size = 5;
last = false;
variantId!: number;
showNotifyModal = false;
selectedOutOfStockSize: any;
guestEmail: string = '';
  constructor(private route: ActivatedRoute, private cd: ChangeDetectorRef, private productService: ProductService, private cartService: CartService,
    private jwtHelper: JwtHelper,private messageService: MessageService,private router: Router,private reviewService:ReviewService,
    private seoService: SeoService, private storeSettingsService: StoreSettingsService) {}

  private commonService = new CommonService();

  get hasDiscount(): boolean {
    const v = this.product.variant;
    return !!v?.mrp && v.mrp > v.retailPrice;
  }

  get discountPercent(): number {
    const v = this.product.variant;
    if (!this.hasDiscount || !v?.mrp) return 0;
    return Math.round(((v.mrp - v.retailPrice) / v.mrp) * 100);
  }

  get discountAmount(): number {
    const v = this.product.variant;
    if (!this.hasDiscount || !v?.mrp) return 0;
    return Math.round(v.mrp - v.retailPrice);
  }
  
  ngOnInit(): void {
    this.loading=true;
    this.setThumbnailPosition();
    this.prepareRatingBreakdown();
    this.route.paramMap.subscribe(params => {
    const idParam = params.get('id') || '';
    if (/^\d+$/.test(idParam)) {
      this.getProductByVariantId(Number(idParam));
    } else {
      this.getProductBySlug(idParam);
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
  });
  }
ngAfterViewInit() {
  this.setThumbnailPosition();
}
  isInWishlist(variant: any): boolean {
  return this.wishlistVariantIds.has(variant.id);
}


scrollToImage(index: number) {

  const container = this.carousel.nativeElement;
  const width = container.offsetWidth;

  container.scrollTo({
    left: width * index,
    behavior: 'smooth'
  });

  this.activeIndex = index;

}

nextImage() {

  if (this.activeIndex < this.images.length - 1) {
    this.activeIndex++;
    this.scrollToImage(this.activeIndex);
  }

}

prevImage() {

  if (this.activeIndex > 0) {
    this.activeIndex--;
    this.scrollToImage(this.activeIndex);
  }

}

openFullscreen(index: number) {

  this.activeIndex = index;
  this.fullscreen = true;

}

closeFullscreen() {

  this.fullscreen = false;

}
  fetchSimilarProducts(variantId:number) {
    this.productService.getSimilarProducts(variantId).subscribe({
      next: (data) => {
         const variants = data?.variants ?? [];
        this.relatedItems = variants?.map((variant:any) => {
          
  const frontImage = variant.productImage.find((img:any) => img.viewType === 'front');
  return {
    variantId:variant?.id,
    slug: variant?.slug,
    label: variant.variantName,
    image: frontImage?.imageUrl ? this.commonService.resolveImageUrl(frontImage.imageUrl) : variant.name  // fallback if no front image
  } as RelatedItem;
});
        
      },
      error: (err) => {
        console.error('Error fetching product:', err);
      }
    });
  }
  @HostListener('window:resize')
onResize() {
  this.setThumbnailPosition();
}

@HostListener('window:scroll')
onWindowScroll() {
  // Keep the "Sign up / Sign in" nudge off-screen until the user has
  // scrolled past the price/weight row, so it doesn't cover the buy info
  // on initial load of this page on small screens.
  this.showFloatingCta = window.scrollY > 300;
}

setThumbnailPosition() {
   const isDesktop = window.innerWidth >= 1024;

  const newPosition = isDesktop ? 'left' : 'bottom';

  if (this.thumbnailPosition !== newPosition) {
    this.thumbnailPosition = newPosition;
    this.cd.detectChanges(); // 👈 Force refresh
  }
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
    this.router.navigate(['/product-details', id]);
  }
}





  
  getProductByVariantId(productId:number) {
    this.loading=true;
    this.productService.getProductByVariantId(productId).subscribe({
      next: (data) => this.onProductLoaded(data),
      error: (err) => {
        console.error('Error fetching product:', err);
        this.loading=false;
      }
    });
  }

  getProductBySlug(slug: string) {
    this.loading=true;
    this.productService.getProductByVariantSlug(slug).subscribe({
      next: (data) => this.onProductLoaded(data),
      error: (err) => {
        console.error('Error fetching product:', err);
        this.loading=false;
      }
    });
  }

  private onProductLoaded(data: Product) {
    this.product = data;
    this.product.variant = data.variant;
    this.product.variant.variantName = data.variant.variantName;
    this.product.variant.productImage = data.variant.productImage ?? [];
    this.images = this.product.variant.productImage.map((img: any) => ({
      itemImageSrc: this.commonService.resolveImageUrl(img.imageUrl),
      thumbnailImageSrc: this.commonService.resolveImageUrl(img.imageUrl),
      alt: this.product?.name,
    }));
    this.loading=false;
    this.productId = data.variant.id;
    this.fetchSimilarProducts(data.variant.id);

    const canonicalPath = data.variant.slug ? `/product-details/${data.variant.slug}` : `/product-details/${data.variant.id}`;
    this.seoService.update({
      title: `${this.product.variant.variantName || this.product.name} - Buy Online`,
      description: this.product.shortDescription || `Buy ${this.product.name} online. Authentic quality, retail and wholesale pricing available at ${this.storeSettingsService.current.storeName}.`,
      image: this.commonService.resolveImageUrl(this.product.variant.productImage?.[0]?.imageUrl),
      canonicalUrl: typeof window !== 'undefined' ? `${window.location.origin}${canonicalPath}` : undefined
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
// Wholesale orders enforce a per-variant minimum quantity on the backend
// (rejected with 400 otherwise), so a wholesale add must start at that
// minimum instead of the retail default of 1.
private cartQuantityFor(variant: any): number {
  const purchaseType = this.cartService.getPurchaseType();
  if (purchaseType === 'WHOLESALE' && variant.minWholesaleQuantity > 0) {
    return variant.minWholesaleQuantity;
  }
  return 1;
}

addToCart(variant: any, event: Event, navigateToCart: boolean = false): void {
  event.stopPropagation();

  this.cartService.addToCart({
    variantId: variant.id,
    quantity: this.cartQuantityFor(variant),
    purchaseType: this.cartService.getPurchaseType(),
  }).subscribe({
    next: () => {
      this.messageService.add({
        key: 'global',
        severity: 'success',
        summary: 'Added to Bag',
        detail: `${variant.variantName} added successfully.`
      });

      if (navigateToCart) {
        this.router.navigate(['/cart']);
      }
    },
    error: (err) => {
      this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'Add Failed',
        detail: err?.error?.message || 'Could not add to cart. Please try again.'
      });
    }
  });
}

//    addToCartBACK(variant: any,event: Event,navigateToCart: boolean = false): void {
//     event.stopPropagation();

//     if (!this.selectedSize || !this.selectedSize.id) {
//       this.isSizeSelected=false;
//     this.messageService.add({
//       key: 'global',
//       severity: 'info',
//       summary: 'Select a Size',
//       detail: 'Please select a size before adding to bag.'
//     });
//     this.openSizeSelector();
//     return;
//   }
//   const payload: any = {
//     variantId: variant.id,
//     sizeId: this.selectedSize.id,
//     color: variant.color,
//     quantity: 1
//   };
//     const sizeId = this.selectedSize.id;
// const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

// if (isLoggedIn) {
//     this.cartService.addToCart({ variantId: variant.id,sizeId:sizeId,color:variant.color, quantity: 1 }).subscribe({
//       next: () => {
//         this.isSizeSelected=true;
//         this.messageService.add({
//           key: 'global',
//           severity: 'info',
//           summary: 'Added to your bag',
//           detail: `${variant.variantName} was added successfully.`
//         });
//         if (navigateToCart) {
//           this.router.navigate(['/cart']);
//         }
//       },
//       error: (err) => {
//         console.error(err);
//         this.messageService.add({
//           key: 'global',
//           severity: 'error',
//           summary: 'Add Failed',
//           detail: 'Could not add to cart. Please try again.'
//         });
//       }
//     });
//   }
//     else {
//     // Guest: Save in localStorage
//     const guestCartKey = 'guestCart';
//     const guestCart = JSON.parse(localStorage.getItem(guestCartKey) || '[]');

//     const newItem = {
//       ...payload,
//       variantName: variant.variantName,
//       size: this.selectedSize.size,
//       price: this.selectedSize.price,
//       discountPercentage: this.selectedSize.discountPercentage,
//       imageUrl: variant.productImage?.[0]?.imageUrl || ''
//     };

//     // Check if already in guest cart
//     const existing = guestCart.find((item: any) =>
//       item.variantId === newItem.variantId &&
//       item.sizeId === newItem.sizeId
//     );

//     if (existing) {
//       existing.quantity += 1;
//     } else {
//       guestCart.push(newItem);
//     }
// console.log("guestCart",guestCart);
//     localStorage.setItem(guestCartKey, JSON.stringify(guestCart));

//     this.messageService.add({
//       key: 'global',
//       severity: 'success',
//       summary: 'Added to Bag',
//       detail: `${variant.variantName} added. Login to checkout.`
//     });

//     //this.showStylePanel = true;
   
//     if (navigateToCart) {
//       this.router.navigate(['/cart']);
//     }
//   }
  
//   }

  

  buyNow(variant: any, event: Event): void {
    event.stopPropagation();

    this.cartService.addToCart({
      variantId: variant.id,
      quantity: this.cartQuantityFor(variant),
      purchaseType: this.cartService.getPurchaseType(),
    }).subscribe({
      next: () => {
        // addToCart() always opens the cart drawer as a side effect; close
        // it before navigating so its mask doesn't linger over checkout.
        this.cartService.closeDrawer();
        // Checkout itself now prompts for sign-in only at the final step
        // (selecting an address / placing the order), so guests can go
        // straight there - no separate login gate here.
        this.router.navigate(['/checkout']);
      },
      error: (err) => {
        this.messageService.add({
          key: 'global',
          severity: 'error',
          summary: 'Add Failed',
          detail: err?.error?.message || 'Could not add to cart. Please try again.'
        });
      }
    });
  }

  responsiveOptions = [
    { breakpoint: '1024px', numVisible: 4 },
    { breakpoint: '768px', numVisible: 4 },
    { breakpoint: '560px', numVisible: 4 }
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

loadReviews(variantId: number) {
  this.variantId = variantId;
  this.page = 0;
  this.reviews = [];
  this.showReviews = true;

  this.fetchReviews();
}

fetchReviews() {
  this.loading = true;

  this.reviewService.getReviews(
    this.variantId,
    this.page,
    this.size
  ).subscribe({
    next: (response: any) => {

      this.reviewSummary = response.summary;
      this.prepareRatingBreakdown();

      this.reviews = [...this.reviews, ...response.reviews];
      this.last = response.last;

      this.loading = false;
    },
    error: (err:any) => {
      console.error(err);
      this.loading = false;
    }
  });
}


loadMore() {
  if (!this.last) {
    this.page++;
    this.fetchReviews();
  }
}

prepareRatingBreakdown() {
  const s = this.reviewSummary;
  const total = s?.totalReviews || 1;

  this.ratingRows = [
    { label: 5, count: s?.fiveStar || 0 },
    { label: 4, count: s?.fourStar || 0 },
    { label: 3, count: s?.threeStar || 0 },
    { label: 2, count: s?.twoStar || 0 },
    { label: 1, count: s?.oneStar || 0 },
  ].map(r => ({
    ...r,
    percentage: (r.count / total) * 100
  }));
}
openNotifyModal(size: any) {
  this.selectedOutOfStockSize = size;
  this.showNotifyModal = true;
}

submitStockInterest() {

  const variantId = this.product.variant.id;
  const sizeId = this.selectedOutOfStockSize.id;
  const email = this.isLoggedIn
    ? this.jwtHelper.getUserInfo().email
    : this.guestEmail;

  this.productService
    .notifyStock(variantId,this.isLoggedIn, sizeId, email)
    .subscribe({
      next: () => {
        this.showNotifyModal = false;
        this.guestEmail = '';
        this.messageService.add({
      key: 'global',
      severity: 'success',
      summary: 'Success',
      detail: 'Your interest was registered'
    });
      }
    });
}

get isGuestEmailValid(): boolean {
  if (this.isLoggedIn) return true;

  if (!this.guestEmail) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(this.guestEmail);
}




}
function calculatedPrice(price: any, discountPercentage: any): number {
  const discount = discountPercentage || 0;
  return Math.round(price - (price * discount / 100)); //round to max no decimal places
}

