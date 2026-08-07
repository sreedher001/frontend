export interface StoreSettings {
  id?: number;
  storeName: string;
  tagline: string;
  aboutDescription: string;
  logoUrl: string;
  faviconUrl: string;
  supportEmail: string;
  supportPhone: string;
  addressLine: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  instagramUrl: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
  websiteDomain: string;
  seoTitle: string;
  seoDescription: string;
  currencySymbol: string;
  primaryColor: string;
}
