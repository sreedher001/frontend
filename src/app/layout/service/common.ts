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
}
