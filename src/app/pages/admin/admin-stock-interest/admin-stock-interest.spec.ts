import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStockInterest } from './admin-stock-interest';

describe('AdminStockInterest', () => {
  let component: AdminStockInterest;
  let fixture: ComponentFixture<AdminStockInterest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminStockInterest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminStockInterest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
