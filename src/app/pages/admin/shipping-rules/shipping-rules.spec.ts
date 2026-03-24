import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingRules } from './shipping-rules';

describe('ShippingRules', () => {
  let component: ShippingRules;
  let fixture: ComponentFixture<ShippingRules>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingRules]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingRules);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
