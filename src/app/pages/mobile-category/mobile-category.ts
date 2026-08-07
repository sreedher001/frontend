import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../products/product.service';
import { SeoService } from '@/seo/seo.service';
import { StoreSettingsService } from '@/store-settings/store-settings.service';
import { CommonService } from '@/layout/service/common';

interface CategoryTab {
  slug: string;
  name: string;
}

interface CategoryItem {
  categorySlug: string;
  name: string;
  image: string;
  variantId: number | null;
}

@Component({
  selector: 'app-mobile-category',
  imports: [CommonModule],
  templateUrl: './mobile-category.html',
  styleUrl: './mobile-category.scss'
})
export class MobileCategory implements OnInit {

  private commonService = new CommonService();

  constructor(private productService: ProductService, private router: Router, private seoService: SeoService, private storeSettingsService: StoreSettingsService) {}

  categories: CategoryTab[] = [];
  selectedCategory = '';
  isManualScroll = false;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @ViewChild('leftMenu') leftMenu!: ElementRef;

  items: CategoryItem[] = [];
  private categoryNameBySlug = new Map<string, string>();

  ngOnInit() {
    this.seoService.update({
      title: 'Shop by Category',
      description: `Browse products by category at ${this.storeSettingsService.current.storeName}.`
    });

    this.productService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories.map(c => ({ slug: c.slug, name: c.name }));
        this.categoryNameBySlug = new Map(this.categories.map(c => [c.slug, c.name]));
        this.selectedCategory = this.categories[0]?.slug ?? '';
      },
      error: (err) => console.error('Failed to load categories', err)
    });

    this.productService.getAllProducts(0, 100).subscribe({
      next: (response) => {
        this.items = (response.content ?? [])
          .filter(p => p.categoryId)
          .map(p => ({
            categorySlug: this.slugify(p.categoryName),
            name: p.name,
            image: this.commonService.resolveImageUrl(p.thumbnail || p.variant?.imageUrl || p.variants?.[0]?.imageUrl),
            variantId: p.variant?.id ?? p.variants?.[0]?.id ?? null
          }));
      },
      error: (err) => console.error('Failed to load products', err)
    });
  }

  private slugify(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  getItems(slug: string) {
    return this.items.filter(i => i.categorySlug === slug);
  }

  seeAll(slug: string) {
    const category = this.categoryNameBySlug.get(slug) ?? slug;
    this.router.navigate(['/search'], { queryParams: { categoryName: category } });
  }

  openItem(item: CategoryItem) {
    if (item.variantId) {
      this.router.navigate(['/product-details', item.variantId]);
    }
  }

  redirectScroll(event: WheelEvent) {
    const container = this.scrollContainer.nativeElement;
    container.scrollTop += event.deltaY;
  }

  scrollToCategory(slug: string) {
    this.isManualScroll = true; // prevent scroll detection
    this.selectedCategory = slug;

    const container = this.scrollContainer.nativeElement;
    const element = container.querySelector('#cat-' + slug);

    if (!element) return;

    container.scrollTo({
      top: element.offsetTop,
      behavior: 'smooth'
    });

    setTimeout(() => {
      this.isManualScroll = false;
    }, 500); // wait for smooth scroll to finish
  }

  onScroll() {
    if (this.isManualScroll) return;

    const container = this.scrollContainer.nativeElement;
    const scrollTop = container.scrollTop;

    for (let cat of this.categories) {
      const el = container.querySelector('#cat-' + cat.slug);
      if (!el) continue;

      if (el.offsetTop - 60 <= scrollTop) {
        this.selectedCategory = cat.slug;
      }
    }
  }
}
