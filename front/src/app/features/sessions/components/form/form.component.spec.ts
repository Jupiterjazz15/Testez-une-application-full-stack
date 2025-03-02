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
import { Session } from '../../interfaces/session.interface';
import { Validators } from '@angular/forms';
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

  const mockSession: Session = {
    id: 1,
    name: 'Yoga Session',
    date: new Date('2025-02-10'),
    description: 'A relaxing yoga session for beginners.',
    teacher_id: 101,
    users: [1, 2, 3, 4],
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-02-01'),
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

  describe('submit method', () => {
    beforeEach(() => {
      jest.spyOn(mockSessionApiService, 'create').mockReturnValue(of({})); // ✅ Mock création
      jest.spyOn(mockSessionApiService, 'update').mockReturnValue(of({})); // ✅ Mock mise à jour
      jest.spyOn(component as any, 'exitPage').mockImplementation(); // ✅ Empêche la navigation réelle
    });

    it('should call sessionApiService.create when creating a new session', () => {
      component.onUpdate = false; // ✅ Simule un mode création

      component.sessionForm?.setValue({
        name: 'Yoga Class',
        date: '2025-02-10',
        teacher_id: 101,
        description: 'Relaxing yoga session'
      });

      component.submit(); // ✅ Appelle la méthode submit()

      expect(mockSessionApiService.create).toHaveBeenCalledWith({
        name: 'Yoga Class',
        date: '2025-02-10',
        teacher_id: 101,
        description: 'Relaxing yoga session'
      }); // ✅ Vérifie que create() a été appelé avec les bonnes valeurs

      expect(component['exitPage']).toHaveBeenCalledWith('Session created !'); // ✅ Vérifie que exitPage() est bien appelé
    });

    it('should call sessionApiService.update when updating a session', () => {
      component.onUpdate = true; // ✅ Simule un mode mise à jour
      (component as any).id = '1'; // ✅ Forcer l'accès à la propriété privée

      component.sessionForm?.setValue({
        name: 'Updated Class',
        date: '2025-03-15',
        teacher_id: 202,
        description: 'Updated description'
      });

      component.submit(); // ✅ Appelle la méthode submit()

      expect(mockSessionApiService.update).toHaveBeenCalledWith('1', {
        name: 'Updated Class',
        date: '2025-03-15',
        teacher_id: 202,
        description: 'Updated description'
      }); // ✅ Vérifie que update() a été appelé avec les bonnes valeurs

      expect(component['exitPage']).toHaveBeenCalledWith('Session updated !'); // ✅ Vérifie que exitPage() est bien appelé
    });
  });

  describe('initForm method', () => {
    it('should initialize the form with empty values when no session is provided', () => {
      (component as any).initForm();

      expect(component.sessionForm?.value).toEqual({
        name: '',
        date: '',
        teacher_id: '',
        description: ''
      }); // ✅ Vérifie que le formulaire est bien vide
    });

    it('should initialize the form with session values when a session is provided', () => {
      const mockSession: Session = {
        id: 1,
        name: 'Pilates Class',
        date: new Date('2025-04-20'),
        teacher_id: 202,
        description: 'Pilates session for beginners',
        users: [1, 2]
      };

      (component as any).initForm(mockSession);

      expect(component.sessionForm?.value).toEqual({
        name: 'Pilates Class',
        date: '2025-04-20',
        teacher_id: 202,
        description: 'Pilates session for beginners'
      }); // ✅ Vérifie que le formulaire est bien rempli avec la session
    });

    it('should apply required validators on all fields', () => {
      (component as any).initForm();

      expect(component.sessionForm?.controls['name'].hasValidator(Validators.required)).toBe(true);
      expect(component.sessionForm?.controls['date'].hasValidator(Validators.required)).toBe(true);
      expect(component.sessionForm?.controls['teacher_id'].hasValidator(Validators.required)).toBe(true);
      expect(component.sessionForm?.controls['description'].hasValidator(Validators.required)).toBe(true);
    });


  });

  describe('exitPage method', () => {
    let snackBarSpy: jest.SpyInstance;
    let routerSpy: jest.SpyInstance;

    beforeEach(() => {
      snackBarSpy = jest.spyOn(component['matSnackBar'], 'open');
      routerSpy = jest.spyOn(component['router'], 'navigate');
    });

    it('should display a snackbar message and navigate to /sessions', () => {
      (component as any).exitPage('Test message'); // ✅ Appelle exitPage()

      expect(snackBarSpy).toHaveBeenCalledWith('Test message', 'Close', { duration: 3000 });
      expect(routerSpy).toHaveBeenCalledWith(['sessions']);
    });
  });


});

