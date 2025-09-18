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
productId!: number;
product: any={};
  images: any[] = [];
 selectedSize: any = null;
isSizeSelected=false;

  constructor(private route: ActivatedRoute,private productService: ProductService, private cartService: CartService,
    private messageService: MessageService,private router: Router) {}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
    this.productId = Number(params.get('id'));
    this.getProductByVariantId(this.productId);
   // this.fetchProduct();
  });
  }
  // fetchProduct(): Product {
  //   this.productService.getProductById(this.productId).subscribe({
  //     next: (data) => {
  //       this.product = data;
  //       this.images = data.imageUrls.map((img: string) => ({
  //         itemImageSrc: img,
  //         thumbnailImageSrc: img,
  //         alt: this.product.name,
  //       }));
  //     },
  //     error: (err) => {
  //       console.error('Error fetching product:', err);
  //     }
  //   });
  //   return this.product;
  // }
  
  getRatingSeverity(rating: number): string {
  if (rating >= 4) return 'bg-white-100 text-green-500';      // high rating
  if (rating >= 3) return 'bg-white-100 text-yellow-500';     // medium rating
  return 'bg-white-100 text-red-500';                            // low rating
}


  selectSize(size: any) {
  if (size.availableQuantity > 0) {
    this.selectedSize = size;
  }
}
  getProductByVariantId(productId:number) {
    this.productService.getProductByVariantId(productId).subscribe({
      next: (data) => {
        this.product = data;
        this.images = this.product.variant.productImage.map((img: any) => ({
          itemImageSrc: img.imageUrl,
          thumbnailImageSrc: img.imageUrl,
          alt: this.product.name,
        }));
      },
      error: (err) => {
        console.error('Error fetching product:', err);
      }
    });
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
    const sizeId = this.selectedSize.id;
    this.cartService.addToCart({ variantId: variant.id,sizeId:sizeId,color:variant.color, quantity: 1 }).subscribe({
      next: () => {
        this.isSizeSelected=true;
        this.messageService.add({
          key: 'global',
          severity: 'info',
          summary: 'Added to your bag',
          detail: `${variant.variantName} was added successfully.`
        });
        this.showStylePanel=true;
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

relatedItems = [
  {
    label: 'Denim Jacket',
    image: 'assets/images/jacket.jpg',
    description: 'Perfect with your current outfit'
  },
  {
    label: 'White Sneakers',
    image: 'assets/images/sneakers.jpg',
    description: 'Casual and comfortable'
  },
  {
    label: 'Leather Belt',
    image: 'assets/images/belt.jpg',
    description: 'Adds edge to your look'
  }
];


}
