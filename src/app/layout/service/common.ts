export class CommonService {
  public baseUrl: string = '';
  public domain: string = '';

  constructor() {
    const hostname = window.location.hostname;
    const origin = window.location.origin;

    let stage = ''; // default fallback

    // Detect environment based on known domains
    if (hostname.includes('localhost') || hostname === '127.0.0.1') {
      stage = 'local';
    }
    else if (hostname.includes('d12okeuel29ts0.cloudfront.net')) {
      stage = 'dev';
    } else if (hostname.includes('d2abc123xyz.cloudfront.net')) {
      stage = 'qa';
    } else if (hostname.includes('myapp.com')) {
      stage = 'prod';
    }

    switch (stage) {
        case 'local':
            this.domain = 'http://localhost:8080/dev';
            break;
      case 'dev':
        this.domain = 'https://yk0v8xiizl.execute-api.eu-north-1.amazonaws.com/dev';
        break;
      case 'qa':
        this.domain = 'https://qa-api.example.com/qa';
        break;
      case 'stage':
        this.domain = 'https://stage-api.example.com/stage';
        break;
      case 'prod':
        this.domain = 'https://prod-api.example.com/prod';
        break;
      default:
        this.domain = 'https://o0y0tzrazj.execute-api.eu-north-1.amazonaws.com/dev';
        break;
    }

    this.baseUrl = `${this.domain}/api`;
  }
}
