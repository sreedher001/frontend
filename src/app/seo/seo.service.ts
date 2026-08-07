import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { StoreSettingsService } from '@/store-settings/store-settings.service';

export interface SeoData {
  title: string;
  description: string;
  image?: string;
  /** Preferred URL for this content (e.g. the slug-based product URL) — set
   * when a page can also be reached via a non-canonical URL (like a legacy
   * numeric ID), so search engines don't treat both as duplicate content. */
  canonicalUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(private titleService: Title, private meta: Meta, private storeSettingsService: StoreSettingsService,
    @Inject(DOCUMENT) private document: Document) {}

  update(data: SeoData): void {
    const siteName = this.storeSettingsService.current.seoTitle || this.storeSettingsService.current.storeName;
    const fullTitle = `${data.title} | ${siteName}`;
    this.titleService.setTitle(fullTitle);

    this.setTag('name="description"', data.description);
    this.setTag('property="og:site_name"', siteName);
    this.setTag('property="og:title"', fullTitle);
    this.setTag('property="og:description"', data.description);
    this.setTag('name="twitter:title"', fullTitle);
    this.setTag('name="twitter:description"', data.description);

    if (data.image) {
      this.setTag('property="og:image"', data.image);
    }

    if (typeof window !== 'undefined') {
      const url = data.canonicalUrl || window.location.href;
      this.setTag('property="og:url"', url);
      this.setCanonical(url);
    }
  }

  private setCanonical(url: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setTag(selector: string, content: string): void {
    if (!content) return;
    this.meta.updateTag({ content }, selector);
  }
}
