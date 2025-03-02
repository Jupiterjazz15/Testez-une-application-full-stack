import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { TeacherService } from 'src/app/services/teacher.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { expect } from '@jest/globals';

import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { FormComponent } from './form.component';
import {ActivatedRoute, Router} from "@angular/router";

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let mockRouter: any;

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

  mockRouter = {
    navigate: jest.fn(),
    get url() {
      return '/sessions/create'; // ✅ Propriété avec un getter
    }
  };

  beforeEach(async () => {
    // Interception des erreurs réseau dans Jest
    jest.spyOn(console, 'error').mockImplementation((message) => {
      if (typeof message === 'string' && message.includes('XMLHttpRequest')) {
        return;
      }
      console.warn(message);
    });

    // Suppression des warnings liés aux erreurs réseau
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    // ✅ Configuration Jest et création du composant AVANT de faire fixture.detectChanges()
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => {
                  if (key === 'id') return '1'; // ✅ Simulation d'un ID si besoin
                  return null;
                }
              }
            }
          }
        }
      ],
      declarations: [FormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  // TESTS UNITAIRES

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

  // TESTS D'INTEGRATION

// TESTS D'INTEGRATION

  describe('ngOnInit method', () => {
    beforeEach(() => {
      jest.spyOn(mockSessionApiService, 'detail').mockReturnValue(of({
        id: '1',
        name: 'Yoga Class',
        date: '2025-02-10',
        teacher_id: 101,
        description: 'Relaxing yoga session'
      }));
    });

    it('should redirect if the user is not an admin', () => {
      // Simuler un utilisateur NON admin
      mockSessionService.sessionInformation.admin = false;
      const navigateSpy = jest.spyOn(mockRouter, 'navigate');

      component.ngOnInit(); // ✅ Appelle `ngOnInit()`

      expect(navigateSpy).toHaveBeenCalledWith(['/sessions']); // ✅ Vérifie la redirection
    });

    it('should set onUpdate to true if the URL contains "update"', () => {
      Object.defineProperty(mockRouter, 'url', {
        get: jest.fn(() => '/sessions/update/1') // ✅ Correcte manière de mocker un getter
      });

      component.ngOnInit();

      expect(component.onUpdate).toBe(true); // ✅ Vérifie que `onUpdate` est bien activé
      expect(mockSessionApiService.detail).toHaveBeenCalledWith('1'); // ✅ Vérifie que l'API est appelée avec l'ID correct
    });

    it('should initialize the form with session details if updating', () => {
      Object.defineProperty(mockRouter, 'url', {
        get: jest.fn(() => '/sessions/update/1') // ✅ Correcte manière de mocker un getter
      });

      component.ngOnInit();

      expect(component.sessionForm?.value).toEqual({
        name: 'Yoga Class',
        date: '2025-02-10',
        teacher_id: 101,
        description: 'Relaxing yoga session'
      }); // ✅ Vérifie que le formulaire est bien rempli avec la session
    });

    it('should initialize an empty form if not updating', () => {
      Object.defineProperty(mockRouter, 'url', {
        get: jest.fn(() => '/sessions/create') // ✅ Bonne URL pour un test de création
      });

      component.ngOnInit();

      expect(component.sessionForm?.value).toEqual({
        name: '',
        date: '',
        teacher_id: '',
        description: ''
      }); // ✅ Vérifie que le formulaire est vide en mode création
    });
  });

  
});

