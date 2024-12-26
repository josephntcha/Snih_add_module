import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicDayComponent } from './public-day.component';

describe('PublicDayComponent', () => {
  let component: PublicDayComponent;
  let fixture: ComponentFixture<PublicDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicDayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
