import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addvariant } from './addvariant';

describe('Addvariant', () => {
  let component: Addvariant;
  let fixture: ComponentFixture<Addvariant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addvariant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addvariant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
