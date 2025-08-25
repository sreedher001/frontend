import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  getData() {
    return [
      { name: 'Red', code: 'RED' },
      { name: 'Blue', code: 'BLU' },
      { name: 'Green', code: 'GRN' },
      { name: 'Yellow', code: 'YLW' },
      { name: 'Black', code: 'BLK' },
      { name: 'White', code: 'WHT' },
      { name: 'Orange', code: 'ORG' },
      { name: 'Purple', code: 'PRP' },
      { name: 'Pink', code: 'PNK' },
      { name: 'Brown', code: 'BRN' },
      { name: 'Gray', code: 'GRY' },
      { name: 'Cyan', code: 'CYN' },
      { name: 'Magenta', code: 'MAG' },
      { name: 'Teal', code: 'TEA' },
      { name: 'Navy', code: 'NVY' },
      { name: 'Olive', code: 'OLV' },
      { name: 'Maroon', code: 'MRN' },
      { name: 'Gold', code: 'GLD' },
      { name: 'Silver', code: 'SLV' },
      { name: 'Beige', code: 'BEI' }
    ];
  }

  getColors() {
    return Promise.resolve(this.getData());
  }
}
