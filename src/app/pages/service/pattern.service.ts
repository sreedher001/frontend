import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PatternService {
  getData() {
    return [
      { name: 'Solid', code: 'SOL' },
      { name: 'Striped', code: 'STP' },
      { name: 'Checked', code: 'CHK' },
      { name: 'Printed', code: 'PRT' },
      { name: 'Floral', code: 'FLR' },
      { name: 'Geometric', code: 'GEO' },
      { name: 'Embroidered', code: 'EMB' },
      { name: 'Abstract', code: 'ABS' },
      { name: 'Animal Print', code: 'ANP' }
    ];
  }

  getPatterns() {
    return Promise.resolve(this.getData());
  }
}
