import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adminorderdetails } from './adminorderdetails';

describe('Adminorderdetails', () => {
  let component: Adminorderdetails;
  let fixture: ComponentFixture<Adminorderdetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adminorderdetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adminorderdetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
