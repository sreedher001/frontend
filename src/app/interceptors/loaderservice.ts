import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private loaderCount = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(private zone: NgZone) {}

  show(): void {
  this.zone.run(() => {
    this.loaderCount++;
    console.log('LoaderService: show called, count =', this.loaderCount);
    this.loadingSubject.next(true);
  });
}

hide(): void {
  this.zone.run(() => {
    this.loaderCount = Math.max(this.loaderCount - 1, 0);
    console.log('LoaderService: hide called, count =', this.loaderCount);
    if (this.loaderCount === 0) {
      this.loadingSubject.next(false);
    }
  });
}

}
