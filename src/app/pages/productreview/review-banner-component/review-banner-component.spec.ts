import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewBannerComponent } from './review-banner-component';

describe('ReviewBannerComponent', () => {
  let component: ReviewBannerComponent;
  let fixture: ComponentFixture<ReviewBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
