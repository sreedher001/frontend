import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Searchresult } from './searchresult';

describe('Searchresult', () => {
  let component: Searchresult;
  let fixture: ComponentFixture<Searchresult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Searchresult]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Searchresult);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
