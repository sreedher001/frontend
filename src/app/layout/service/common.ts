export class CommonService {
  public baseUrl: string = '';
  public domain: string = '';

  constructor() {
    const hostname = window.location.hostname;
    const origin = window.location.origin;

    // Detect environment
    if (hostname.includes('localhost') || hostname === '127.0.0.1') {
      // Local development
      this.domain = 'http://localhost:8080';
    } else {
      // Production - Hostinger VPS (Nginx reverse proxy)
      this.domain = origin;
    }

    this.baseUrl = `${this.domain}/api`;
  }

  /**
   * Locally-uploaded images (products/banners) are stored as paths relative
   * to the backend's /uploads static mount (e.g. "banners/xyz.png") and need
   * the backend origin prefixed. External URLs and bundled assets are
   * returned unchanged.
   */
  resolveImageUrl(path: string | null | undefined): string {
    if (!path) return 'assets/no-image.png';
    if (/^(https?:)?\/\//i.test(path) || path.startsWith('assets/') || path.startsWith('data:')) {
      return path;
    }
    return `${this.domain}/uploads/${path}`;
  }
}
