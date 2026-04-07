import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Otpauth } from './otpauth';

describe('Otpauth', () => {
  let component: Otpauth;
  let fixture: ComponentFixture<Otpauth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Otpauth]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Otpauth);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
