import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Salestrend } from './salestrend';

describe('Salestrend', () => {
  let component: Salestrend;
  let fixture: ComponentFixture<Salestrend>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Salestrend]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Salestrend);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
