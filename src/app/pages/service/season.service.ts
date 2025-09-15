import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SeasonService {
  getData() {
    return [
      { name: 'All Season', code: 'ALL' },
      { name: 'Summer', code: 'SUM' },
      { name: 'Winter', code: 'WIN' },
      { name: 'Spring', code: 'SPR' },
      { name: 'Autumn', code: 'AUT' },
      { name: 'Rainy', code: 'RAI' }
    ];
  }

  getSeasons() {
    return Promise.resolve(this.getData());
  }
}
