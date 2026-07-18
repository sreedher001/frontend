import { Product } from '@/models/product.model';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, Injectable, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Carousel, CarouselModule } from 'primeng/carousel';
import { FluidModule } from 'primeng/fluid';
import { TagModule } from 'primeng/tag';
import { Banner, ProductService } from './product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelper } from '@/jwt/jwt-helper';
import { CartService } from '../cart/cart.service';
import { MessageService } from 'primeng/api';
import { Rating } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { Tooltip } from 'primeng/tooltip';
import { ProductResponse } from '@/models/product-response.model';
import { ProductVariantResponseDto } from '@/models/productVariantResponseDto';
import { ChipModule } from 'primeng/chip';
import { Signup } from "../auth/signup/signup";
import {  LoginComponent } from "../auth/login";
import { ReviewBannerComponent } from "../productreview/review-banner-component/review-banner-component";
import { MOOD_CONFIG } from './mood-config';
import { COLLECTION_CONFIG } from './collection-config';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ReelService } from '../admin/reel-component/reel.service';

@Component({
  selector: 'app-products',
  imports: [CardModule, CommonModule, ButtonModule, FluidModule, TagModule, FormsModule, BadgeModule, Tooltip, CarouselModule,
    ChipModule, Signup, LoginComponent, ReviewBannerComponent],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
@Injectable({
  providedIn: 'root' 
})
export class Products implements OnInit {
  @ViewChild('collectionContainer') collectionContainer!: ElementRef;
  showSizes = false;
selectedSize: any = null; selectedVariant: any;
 showAiAssistant = false;
 isViewerOpen= false;
  userInput = '';
  chatMessages: any[] = [];
banners: Banner[] = [];
  aiSuggestions = [
  '💍 Wedding Guest',
  '🎉 Festive Party',
  '🏢 Office Ethnic Day',
  '🌸 Casual Brunch',
  '🌙 Evening Gala',
  '👗 Daily Elegance'
];

isTyping = false;
  aiTaglines = [
    "Tell me your occasion 💬",
    "Discover your look ✨",
    "What’s your next event? 👗",
    "Style. Smart. Simplified.",
    "Your personal AI stylist 🤖",
    "Let’s find your vibe 💫"
  ];
  aiTagline = this.aiTaglines[0];
  private index = 0;
 scrollTimeout: any;
Math = Math;
wishlistVariantIds: Set<number> = new Set(); // Store variant IDs in wishlist
wishlistItems: any[] = [];
searchQuery:String='';
selectedChip: any = null;
  products: Product[] = [];
  productResponseDto!:ProductResponse;
  loading: boolean = false;
  isAdmin: boolean = false;
showSignupPanel = false;
isLoggedIn:boolean =false;
showLogin = false;
  page: number = 0;
size: number = 10;
lastPage: boolean = false;
showWearSections = false;
private aiIndex = 0;
moods = MOOD_CONFIG;
collections = COLLECTION_CONFIG;

reels: any[] = [];
activeIndex = 0;
//@ViewChildren('videoPlayer') videos!: QueryList<ElementRef<HTMLVideoElement>>;
@ViewChildren('reelCard', { read: ElementRef }) reelCards!: QueryList<ElementRef>;
@ViewChild('carousel') carousel!: ElementRef;
@ViewChildren('previewVideo') videos!: QueryList<ElementRef<HTMLVideoElement>>;
@ViewChildren('videoPlayer') fullVideos!: QueryList<ElementRef<HTMLVideoElement>>;
  constructor(private productService: ProductService,private router: Router,private jwtHelper: JwtHelper,
     private cartService: CartService, private reelService: ReelService,
    private messageService: MessageService,private route: ActivatedRoute
  ) {
  }
  ngAfterViewInit() {

  setTimeout(() => {
    this.onScroll();
    this.controlVideos();
  });

}
  ngOnInit(): void {
this.getBanners();
    this.startTaglineRotation();

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
    this.route.queryParams.subscribe(params => {
      this.showWearSections = !params['search'];

    const searchQuery = params['search'];

    if (searchQuery) {
      this.fetchSearchedProducts(searchQuery); // If query param exists, search
    } else {
      this.fetchProducts(); // Else load all products
    }
  });

 const user = this.jwtHelper.getUserDetails();
  console.log('User info:', user);
  const roles = this.jwtHelper.getUserRoles();
  if (roles.includes('ROLE_ADMIN')) {
    this.isAdmin=true;
  }

  const isExpired = this.jwtHelper.isTokenExpired();
  console.log('Token expired:', isExpired);


  if (isExpired) {
  localStorage.removeItem('authToken');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userName');

  sessionStorage.clear(); // this is fine

  this.jwtHelper.logout();
  this.isLoggedIn = false;
}
  this.loadReels();

  }
  loadReels() {

  this.reelService.getAllReels().subscribe({
    next: (data) => {

      this.reels =data.map((r: any) => ({
  ...r,
  liked: false
}));


    },
    error: (err) => {
      console.error("Failed to load reels", err);
    }
  });

}
  openCollection(collection: any) {

  this.router.navigate(['/search'], {
    queryParams: {
      [collection.filterKey]: collection.filterValue
    }
  });

}
getDeviceId(): string {

  let deviceId = localStorage.getItem('deviceId');

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem('deviceId', deviceId);
  }

  return deviceId;
}
toggleLike(reel: any, event: Event) {

  event.stopPropagation();
const userId = this.jwtHelper.getUserInfo()?.id || null;
  const deviceId = this.getDeviceId();
  this.reelService.toggleLike(reel.id, userId, deviceId)
    .subscribe((res: any) => {

      reel.likes = res.like;
    reel.liked = res.liked;

    });
}
shareReel(reel: any, event: Event) {

  event.stopPropagation();

  if (navigator.share) {

    navigator.share({
      title: reel.title,
      text: reel.caption,
      url: window.location.origin + '/reel/' + reel.id
    });

  } else {

    navigator.clipboard.writeText(window.location.origin + '/reel/' + reel.id);
    alert('Link copied!');
  }

}
  centerOnLoad() {
  setTimeout(() => {
    if (!this.reelCards || this.reelCards.length === 0) return;

    this.activeIndex = 0;
    this.scrollToCenter(0);
  }, 200);
}
  scrollToCenter(index: number) {
  const container = this.carousel.nativeElement;
  const card = this.reelCards.toArray()[index].nativeElement;

  const containerRect = container.getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();

  const containerCenter = containerRect.left + containerRect.width / 2;
  const cardCenter = cardRect.left + cardRect.width / 2;

  const scrollOffset = cardCenter - containerCenter;

  container.scrollBy({
    left: scrollOffset,
    behavior: 'smooth'
  });
}
 onScroll() {

  clearTimeout(this.scrollTimeout);

  this.scrollTimeout = setTimeout(() => {
    this.detectActiveCard();
  }, 10);

}

detectActiveCard() {

  const container = this.carousel.nativeElement;
  const center = container.scrollLeft + container.offsetWidth / 2;

  let closestIndex = 0;
  let closestDistance = Infinity;

  this.reelCards.forEach((card, index) => {

    const el = card.nativeElement;
    const cardCenter = el.offsetLeft + el.offsetWidth / 2;
    const distance = Math.abs(center - cardCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }

  });

  if (this.activeIndex !== closestIndex) {
    this.activeIndex = closestIndex;
    this.controlVideos();
  }

}

controlVideos() {

  this.videos.forEach((videoRef, index) => {

    const video = videoRef.nativeElement;

    if (index === this.activeIndex) {

      video.muted = true;
      video.play().catch(() => {});

    } else {

      video.pause();
      video.currentTime = 0;

    }

  });

}
openSizes(variant: any) {
  this.selectedVariant = variant;
  this.showSizes = true;
}

closeSizes() {
  this.showSizes = false;
  this.selectedSize = null;
}

selectSize(size: any) {
  console.log("size =",size )
  if (size.availableQuantity === 0) return;

  this.selectedSize = size;
  console.log("selectedsize =",this.selectedSize )

  // Auto add
 this.addToCart();
}
addToCart() {
  if (!this.selectedVariant) return;

  const variant = this.selectedVariant;

  const payload = {
    variantId: variant.id,
    quantity: 1,
    purchaseType: this.cartService.getPurchaseType(),
  };

  this.cartService.addToCart(payload).subscribe({
    next: () => {
      this.messageService.add({
        key: 'global',
        severity: 'success',
        summary: 'Added to Bag',
        detail: `${variant.variantName} added successfully`
      });

      this.closeSizes();
    },
    error: () => {
      this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to add item'
      });
    }
  });

  this.closeSizes();
}

getStartingPrice(variant: any): number {
  return variant?.retailPrice || 0;
}

  getBanners() {
   this.productService.getAllBanners().subscribe({
      next: (data) => (this.banners = data),
      error: (err) => console.error('Failed to load banners:', err)
    });
  }

  startTaglineRotation() {
  setInterval(() => {
    this.aiIndex = (this.aiIndex + 1) % this.aiTaglines.length;
    this.aiTagline = this.aiTaglines[this.aiIndex];
  }, 4000);}
selectChip(chip: any) {
  
  this.selectedChip = chip;
  const style=chip.label;
 this.router.navigate(['/search', style]);
}

// checkDeviceAndAuthStatus() {
//   const isMobileWidth = window.innerWidth <= 768;
//   const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

//   // Basic mobile detection using user agent
//   const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());

//   const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

//   this.showMobileAuthUI = isMobileWidth && isMobileDevice && isLoggedIn;
// }

chips = [
  {
    label: 'Ethnic Wear',
    image: '',
  },
  {
    label: 'Mom&Daughter',
    image: '',
  },
  {
    label: 'Casual Wear',
    image: '',
  },
  
];
navigateTo(link: string): void {
  this.router.navigateByUrl(link);
}
  getFrontImageFromVariant(variant: any): string | null {
  const frontImage = variant.productImage?.find((img: any) => img.viewType === 'front');
  return frontImage?.imageUrl || null;
}

handleLoginSuccess($event:any) {
  this.isLoggedIn = true;
  this.showSignupPanel = false;

  // Refresh the current page
  window.location.reload();
}

  // fetchProducts(): void {
  //   this.loading = true;
  //   this.productService.getAllProducts(0, 10).subscribe({
  //     next: (res) => {
  //       this.productResponseDto=res;
  //       this.products = this.productResponseDto.content;
  //       this.loading = false;
        
  //     },
  //     error: (err) => {
  //       console.error('Failed to fetch products:', err);
  //       this.loading = false;
  //        this.messageService.add({
  //         key: 'global',
  //         severity: 'error',
  //         summary: 'Oops!',
  //         detail: 'Failed to fetch the products'
  //       });
  //     }
  //   });

  // }

  fetchProducts(): void {
  if (this.lastPage || this.loading) return;

  this.loading = true;

  this.productService.getAllProducts(this.page, this.size).subscribe({
    next: (res: any) => {
      const newProducts = Array.isArray(res?.content) ? res.content : [];
      
      if (newProducts.length) {
        this.products = [...this.products, ...newProducts];
        this.page++;
      }

      // Check if last page
      this.lastPage = res?.last || newProducts.length < this.size;

      this.loading = false;
    },
    error: (err) => {
      console.error('Failed to fetch products:', err);
      this.loading = false;
      this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'Oops!',
        detail: 'Failed to fetch the products'
      });
    }
  });
}


  fetchSearchedProducts(searchQuery:any): void {
    this.products=[];
    this.loading = true;
    this.productService.getSearchedProducts(searchQuery).subscribe({
      next: (res) => {
        this.productResponseDto = res;
        this.products.push(...res.content);
        this.lastPage = res.last; // comes from Spring Data Page
      this.page++; // increment for next call
      this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch products:', err);
        this.loading = false;
         this.messageService.add({
          key: 'global',
          severity: 'error',
          summary: 'Oops!',
          detail: 'Failed to fetch the products'
        });
      }
    });

  }

  /**
   * Get the first "front" image of the first available variant.
   */
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
  onCardClick(product:Product,variant:ProductVariantResponseDto) {
  this.router.navigate(['/product-details',variant.id]);
  this.fetchProducts();
}
  buyNow(product: Product): void {
    console.log('Buying:', product.name);
    // implement navigation to checkout or detail page
  }

  // addToCart(product: Product,variant:ProductVariantResponseDto): void {
  //   //event.stopPropagation();
  //   this.cartService.addToCart({ productId: product.id, quantity: 1 }).subscribe({
  //     next: () => {
  //       this.messageService.add({
  //         key: 'global',
  //         severity: 'success',
  //         summary: 'Added to cart',
  //         detail: `${product.name} was added successfully.`
  //       });
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       this.messageService.add({
  //         key: 'global',
  //         severity: 'error',
  //         summary: 'Add Failed',
  //         detail: 'Could not add to cart. Please try again.'
  //       });
  //     }
  //   });
    
  // }
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
  // if (this.showSignupPanel) {
  //   this.showLogin = false;
  // }
}
toggleLogin() {
  this.showLogin = !this.showLogin;
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


  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'success';
    }
  }

  getFinalPrice(product: any): number {
  if (product.variants && product.variants.length > 0) {
    return product.variants[0].retailPrice || 0;
  }
  return 0;
}
getDeliveryDate(): string {
  const today = new Date();
  today.setDate(today.getDate() + 5); // e.g., 5 days from now
  return today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

getSavings(product: any): string {
  return '';
}
getOriginalPrice(product: any): number {
  return product.variants?.[0]?.retailPrice ?? 0;
}

hasDiscount(product: any): boolean {
  return false;
}


  carouselResponsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];





getVariantFrontImage(variant: any): string {
  const frontImage = variant.productImage?.find((img: any) => img.viewType === 'front');
  return frontImage?.imageUrl;
}

getVariantFinalPrice(variant: any): number {
  return variant?.retailPrice || 0;
}

getVariantSavings(variant: any): string {
  return '';
}

getBestSize(variant: any) {
  return null;
}

getRating(variant: any) {
  return variant.rating;
  
}

offers = [
  {
    title: '🎉 New Arrivals Just Dropped!',
    subtitle: 'Check out our latest festive collection.',
    image: 'assets/banners/new-arrivals.jpg',
    cta: 'Shop Now',
    link: '/collections/new'
  },
  {
    title: '🚚 Free Shipping on Orders Above ₹999',
    subtitle: 'Limited time offer. Don’t miss out!',
    image: 'assets/banners/free-shipping.jpg',
    cta: 'Grab Offer',
    link: '/shipping-info'
  },
  {
    title: '🔥 Grab best Off on Ethnic Wear',
    subtitle: 'Offer ends soon!',
    image: 'assets/banners/ethnic-sale.jpg',
    cta: 'Use Code',
    link: '/collections/ethnic'
  }
];


// getWearType(wearType:any){
// this.productService.getWearType(wearType).subscribe({
//       next: (res) => {
//         this.productResponseDto = res;
//         this.products.push(...res.content);
//         this.lastPage = res.last; // comes from Spring Data Page
//       this.page++; // increment for next call
//       this.loading = false;
//       },
//       error: (err) => {
//         console.error('Failed to fetch products:', err);
//         this.loading = false;
//          this.messageService.add({
//           key: 'global',
//           severity: 'error',
//           summary: 'Oops!',
//           detail: 'Failed to fetch the products'
//         });
//       }
//     });
// }

getWearType(styleCategory: any) {
  this.router.navigate(['/search'], {
    queryParams: { styleCategory }
  });
}




toggleAiAssistant() {
    this.showAiAssistant = !this.showAiAssistant;
  }
autoGrow(event: Event) {
  const textarea = event.target as HTMLTextAreaElement;
  textarea.style.height = 'auto'; // reset height
  textarea.style.height = `${textarea.scrollHeight}px`; // set height based on content
}

  sendMessage() {
  if (!this.userInput.trim()) return;
  const query = this.userInput;
  this.chatMessages.push({ text: query, sender: 'user' });
  this.userInput = '';

  this.isTyping = true;

  setTimeout(() => {
    this.isTyping = false;
    this.chatMessages.push({
      text: `Here are some suggestions for "${query}". Check our collections for the best picks!`,
      sender: 'bot'
    });
  }, 1000);
}

selectSuggestion(text: string) {
  this.userInput = text;
  this.sendMessage();
}
// goCategory(){
//  //this.router.navigate(['/category']);

// }

goCategory() {
  this.collectionContainer.nativeElement.scrollIntoView({
    behavior: 'smooth'
  });
}

openReel(index: number) {

  this.activeIndex = index;
  this.isViewerOpen = true;

  //  STOP preview videos (already correct logic)
  this.videos.forEach(v => {
    const video = v.nativeElement;
    video.pause();
  });

  //  START ONLY SELECTED FULLSCREEN VIDEO WITH AUDIO
  setTimeout(() => {
    this.fullVideos.forEach((v, i) => {
      const video = v.nativeElement;

      if (i === index) {
        video.muted = false; //  enable sound
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, 150);
}

closeReel() {

  this.isViewerOpen = false;

  //  STOP ALL FULLSCREEN VIDEOS
  this.fullVideos?.forEach(v => {
    const video = v.nativeElement;
    video.pause();
    video.currentTime = 0;
    video.muted = true;
  });

  //  Resume preview logic (Amazon behavior)
  setTimeout(() => {
    this.controlVideos();
  }, 100);
}

setupObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target as HTMLVideoElement;

      if (entry.isIntersecting) {
        video.play();
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.7 });

  this.videos.forEach(v => observer.observe(v.nativeElement));
}
}
function calculatedPrice(price: any, discountPercentage: any) {
  const discount = discountPercentage || 0;
  return price - (price * discount / 100);
}

