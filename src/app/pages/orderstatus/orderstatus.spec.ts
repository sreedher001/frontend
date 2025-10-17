import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Orderstatus } from './orderstatus';

describe('Orderstatus', () => {
  let component: Orderstatus;
  let fixture: ComponentFixture<Orderstatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Orderstatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Orderstatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
