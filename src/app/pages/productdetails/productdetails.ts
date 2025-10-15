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

interface RelatedItem {
  variantId:number;
  label: string; // Variant name
  image: string; // Front image URL
}
@Component({
  selector: 'app-productdetails',
  imports: [GalleriaModule, ButtonModule, FormsModule,BadgeModule,TagModule,PanelMenuModule,CarouselModule],
  templateUrl: './productdetails.html',
  styleUrl: './productdetails.scss'
})
@Injectable({
  providedIn: 'root' 
})
export class Productdetails implements OnInit {
viewSimilar(arg0: number) {
this.showStylePanel = !this.showStylePanel;
}
relatedItems: RelatedItem[] = [];
productId!: number;
productResponse!:ProductResponse;

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
    sizes: []
  },
  sizes: []
};

  images: any[] = [];
 selectedSize: any = null;
isSizeSelected=false;
//hasRelatedItems=true;
loading=true;

  constructor(private route: ActivatedRoute,private productService: ProductService, private cartService: CartService,
    private messageService: MessageService,private router: Router) {}
  
  ngOnInit(): void {
    this.loading=true;
    this.route.paramMap.subscribe(params => {
    this.productId = Number(params.get('id'));
    this.getProductByVariantId(this.productId);
    this.fetchSimilarProducts(this.productId);
    
    
  });
  }
  fetchSimilarProducts(variantId:number): Product {
    this.productService.getSimilarProducts(variantId).subscribe({
      next: (data) => {
        this.product = data;
        if(this.product.variants.length<=1){
          // this.hasRelatedItems=false;
          console.log("length=",this.product.variants.length);
        }
        this.relatedItems = this.product.variants.map((variant:any) => {
          
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
    return this.product;
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
    this.product.variant.productImage = [];
this.product.variant.sizes = [];

    this.productService.getProductByVariantId(productId).subscribe({
      next: (data) => {

      this.product = data;
      this.product.variant.sizes =data.variant.sizes?? [];
      this.product.variant.productImage=data.variant.productImage ?? [];
        this.images = this.product.variant.productImage.map((img: any) => ({
          itemImageSrc: img.imageUrl,
          thumbnailImageSrc: img.imageUrl,
          alt: this.product.name,
        }));this.loading=false;
      },
      error: (err) => {
        console.error('Error fetching product:', err);
        this.loading=false;
      }
    });
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
      image: variant.productImage?.[0]?.imageUrl || ''
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

    localStorage.setItem(guestCartKey, JSON.stringify(guestCart));

    this.messageService.add({
      key: 'global',
      severity: 'success',
      summary: 'Added to Bag (Guest)',
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
}



}
