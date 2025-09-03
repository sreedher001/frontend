import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Manageproducts } from './manageproducts';

describe('Manageproducts', () => {
  let component: Manageproducts;
  let fixture: ComponentFixture<Manageproducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Manageproducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Manageproducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
