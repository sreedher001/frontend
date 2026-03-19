import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileCategory } from './mobile-category';

describe('MobileCategory', () => {
  let component: MobileCategory;
  let fixture: ComponentFixture<MobileCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
