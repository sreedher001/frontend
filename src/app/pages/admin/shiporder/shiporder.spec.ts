import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Shiporder } from './shiporder';

describe('Shiporder', () => {
  let component: Shiporder;
  let fixture: ComponentFixture<Shiporder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shiporder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Shiporder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
