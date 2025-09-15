import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OccasionService {
  getData() {
    return [
      { name: 'Casual', code: 'CAS' },
      { name: 'Formal', code: 'FOR' },
      { name: 'Party', code: 'PTY' },
      { name: 'Wedding', code: 'WED' },
      { name: 'Festive', code: 'FES' },
      { name: 'Workwear', code: 'WRK' },
      { name: 'Daily Wear', code: 'DAY' },
      { name: 'Vacation', code: 'VAC' }
    ];
  }

  getOccasions() {
    return Promise.resolve(this.getData());
  }
}
