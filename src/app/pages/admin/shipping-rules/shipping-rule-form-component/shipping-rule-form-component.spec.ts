import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingRuleFormComponent } from './shipping-rule-form-component';

describe('ShippingRuleFormComponent', () => {
  let component: ShippingRuleFormComponent;
  let fixture: ComponentFixture<ShippingRuleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingRuleFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingRuleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
