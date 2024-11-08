import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientConnexionComponent } from './patient-connexion.component';

describe('PatientConnexionComponent', () => {
  let component: PatientConnexionComponent;
  let fixture: ComponentFixture<PatientConnexionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientConnexionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientConnexionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
