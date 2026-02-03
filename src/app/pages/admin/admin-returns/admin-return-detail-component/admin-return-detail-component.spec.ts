import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReturnDetailComponent } from './admin-return-detail-component';

describe('AdminReturnDetailComponent', () => {
  let component: AdminReturnDetailComponent;
  let fixture: ComponentFixture<AdminReturnDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReturnDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminReturnDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
