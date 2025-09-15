import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FitService {
  getData() {
    return [
      { name: 'Regular', code: 'REG' },
      { name: 'Slim', code: 'SLM' },
      { name: 'Loose', code: 'LOS' },
      { name: 'Bodycon', code: 'BDC' },
      { name: 'Oversized', code: 'OVR' },
      { name: 'Tailored', code: 'TLR' }
    ];
  }

  getFits() {
    return Promise.resolve(this.getData());
  }
}
