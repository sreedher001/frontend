import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, firstValueFrom, of, tap, timeout } from 'rxjs';
import { updatePreset } from '@primeuix/themes';
import { CommonService } from '@/layout/service/common';
import { generatePalette } from '@/shared/palette';
import { StoreSettings } from './store-settings.model';

/**
 * Generic, deployment-safe fallback so the storefront never shows blank
 * chrome if the API is briefly unreachable. Deliberately store-neutral -
 * this is what a fresh, un-configured deployment looks like before an
 * admin fills in Store Settings.
 */
const FALLBACK_SETTINGS: StoreSettings = {
  storeName: 'Your Store',
  tagline: '',
  aboutDescription: '',
  logoUrl: 'assets/images/logo.png',
  faviconUrl: 'assets/images/logo.png',
  supportEmail: '',
  supportPhone: '',
  addressLine: '',
  city: '',
  state: '',
  country: '',
  postalCode: '',
  instagramUrl: null,
  facebookUrl: null,
  twitterUrl: null,
  linkedinUrl: null,
  websiteDomain: '',
  seoTitle: 'Your Store',
  seoDescription: '',
  currencySymbol: '₹',
  primaryColor: '#c2410c'
};

@Injectable({ providedIn: 'root' })
export class StoreSettingsService {
  private commonService = new CommonService();
  private baseUrl = this.commonService.baseUrl;

  private settingsSubject = new BehaviorSubject<StoreSettings>(FALLBACK_SETTINGS);
  settings$ = this.settingsSubject.asObservable();

  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: Document) {}

  get current(): StoreSettings {
    return this.settingsSubject.value;
  }

  /** Called once from an app initializer so the real settings are in
   * place before the topbar/footer/etc first render. Never throws - on
   * failure the app just proceeds with the neutral fallback above. */
  async load(): Promise<void> {
    try {
      const settings = await firstValueFrom(
        this.http.get<StoreSettings>(`${this.baseUrl}/store-settings`).pipe(
          timeout(5000),
          catchError(() => of(null))
        )
      );
      if (settings) {
        this.settingsSubject.next(settings);
        this.applyPrimaryColor(settings.primaryColor);
        this.applyFavicon(settings.faviconUrl);
      }
    } catch {
      // keep FALLBACK_SETTINGS
    }
  }

  update(settings: StoreSettings) {
    return this.http.put<StoreSettings>(`${this.baseUrl}/admin/store-settings`, settings).pipe(
      tap((updated) => {
        this.settingsSubject.next(updated);
        this.applyPrimaryColor(updated.primaryColor);
        this.applyFavicon(updated.faviconUrl);
      })
    );
  }

  /** Points the browser tab icon at the admin-uploaded favicon, if one has
   * been set (falls back to the bundled default otherwise). */
  applyFavicon(faviconUrl: string | null | undefined): void {
    if (!faviconUrl || faviconUrl === 'assets/images/logo.png') return;

    const url = this.commonService.resolveImageUrl(faviconUrl);
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="icon"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'icon');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.baseUrl}/admin/store-settings/upload-image`, formData);
  }

  /** Regenerates the PrimeNG primary color scale from a single hex and
   * applies it live, so the whole app (light + dark) follows the
   * persisted brand color instead of a hardcoded palette. */
  applyPrimaryColor(hex: string | null | undefined): void {
    if (!hex) return;
    const palette = generatePalette(hex);
    updatePreset({
      semantic: {
        primary: palette,
        colorScheme: {
          light: {
            primary: {
              color: '{primary.500}',
              contrastColor: '#ffffff',
              hoverColor: '{primary.600}',
              activeColor: '{primary.700}'
            }
          },
          dark: {
            primary: {
              color: '{primary.400}',
              contrastColor: '{primary.950}',
              hoverColor: '{primary.300}',
              activeColor: '{primary.200}'
            }
          }
        }
      }
    });
  }
}
