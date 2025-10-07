import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Invoicelist } from './invoicelist';

describe('Invoicelist', () => {
  let component: Invoicelist;
  let fixture: ComponentFixture<Invoicelist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Invoicelist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Invoicelist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
