import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TeacherService } from 'src/app/services/teacher.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { expect } from '@jest/globals';

import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { FormComponent } from './form.component';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  };

  const mockTeacherService = {
    all: jest.fn().mockReturnValue(of([])) // ✅ Simuler un retour vide pour éviter l'erreur
  };

  const mockSessionApiService = {
    create: jest.fn().mockReturnValue(of({})),
    update: jest.fn().mockReturnValue(of({})),
    detail: jest.fn().mockReturnValue(of({})),
    delete: jest.fn().mockReturnValue(of({})),
    all: jest.fn().mockReturnValue(of([])),
    participate: jest.fn().mockReturnValue(of({})),
    unParticipate: jest.fn().mockReturnValue(of({}))
  };

  beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation((message) => {
      if (typeof message === 'string' && message.includes('XMLHttpRequest')) {
        return;
      }
      console.warn(message); // 🔹 Cette ligne est remplacée ci-dessous
    });

    // ✅ Suppression des warnings liés aux erreurs réseau
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        NoopAnimationsModule, // ✅ Désactiver les animations pour éviter l'erreur
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService }
      ],
      declarations: [FormComponent]
    }).compileComponents();


    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enable the submit button when the form is valid', async () => {
    await fixture.whenStable();
    expect(component.sessionForm).toBeDefined();

    component.sessionForm!.setValue({
      name: 'Yoga Class',
      date: '2025-02-10',
      teacher_id: 101,
      description: 'Relaxing yoga session'
    });

    fixture.detectChanges();
    await fixture.whenStable();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBeFalsy();
  });

  it('should show an error if a required field is missing', async () => {
    await fixture.whenStable();
    expect(component.sessionForm).toBeDefined();

    // ❌ Oublier un champ obligatoire
    component.sessionForm!.setValue({
      name: '',
      date: '',
      teacher_id: '',
      description: ''
    });

    // 🔹 Marquer les champs comme "touchés" pour déclencher l'affichage des erreurs
    Object.keys(component.sessionForm!.controls).forEach(field => {
      const control = component.sessionForm!.get(field);
      control?.markAsTouched();   // ✅ Forcer Angular à afficher les erreurs
      control?.updateValueAndValidity(); // ✅ Mettre à jour la validation
    });

    fixture.detectChanges();
    await fixture.whenStable();

    // ✅ Vérifier que le bouton est bien désactivé
    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBeTruthy();

    // ✅ Vérifier qu'un message d'erreur est affiché
    const errorMessages = fixture.nativeElement.querySelectorAll('mat-error');
    console.log("Nombre d'erreurs détectées :", errorMessages.length); // Debugging
    expect(errorMessages.length).toBeGreaterThan(0);
  });


});
