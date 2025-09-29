import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adminorder } from './adminorder';

describe('Adminorder', () => {
  let component: Adminorder;
  let fixture: ComponentFixture<Adminorder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adminorder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adminorder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
