import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnownDoctorComponent } from './known-doctor.component';

describe('KnownDoctorComponent', () => {
  let component: KnownDoctorComponent;
  let fixture: ComponentFixture<KnownDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KnownDoctorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KnownDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
