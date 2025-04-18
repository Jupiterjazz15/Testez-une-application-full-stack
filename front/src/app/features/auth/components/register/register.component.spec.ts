import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import {  ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { fakeAsync, flush } from '@angular/core/testing';
import { RegisterRequest } from '../../interfaces/registerRequest.interface';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { expect } from '@jest/globals';
import { throwError } from 'rxjs';


import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let registerRequest: RegisterRequest;
  let mockAuthService: any;
  let router: Router; // Déclarer router ici

  const mockRouter = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    mockAuthService = {
      register: jest.fn().mockReturnValue(of({})), // Mock de l'authService avant l'initialisation de TestBed
    };

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        RouterTestingModule, // Ajout du module de test pour gérer `router`
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Injection correcte après la configuration
    router = TestBed.inject(Router);

    registerRequest = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
    };
  });


  // TESTS UNITAIRES
  it('should create', () => {
    expect(component).toBeTruthy(); // Vérifie que l'instance du composant est bien instanciée
  });

  it('should have a mat-card-title with text "Register"', () => {

    const registerCardTitle: DebugElement = fixture.debugElement.query(By.css('.mat-card-title')); // Récupérer l'élément contenant la classe mat-card-title
    expect(registerCardTitle).toBeTruthy(); // Vérifier que l'élément est trouvé
    expect(registerCardTitle.nativeElement.textContent.trim()).toBe('Register'); // Vérifier que le texte est bien "Register"

  });

  it('should have an input field for "First name"', () => {
    const firstNameInput: DebugElement = fixture.debugElement.query(By.css('input[formControlName="firstName"]'));
    expect(firstNameInput).toBeTruthy();
  });

  it('should have an input field for "Last name"', () => {
    const lastNameInput: DebugElement = fixture.debugElement.query(By.css('input[formControlName="lastName"]'));
    expect(lastNameInput).toBeTruthy();
  });

  it('should have an input field for "Email"', () => {
    const emailInput: DebugElement = fixture.debugElement.query(By.css('input[formControlName="email"]'));
    expect(emailInput).toBeTruthy();
  });

  it('should have an input field for "Password"', () => {
    const passwordInput: DebugElement = fixture.debugElement.query(By.css('input[formControlName="password"]'));
    expect(passwordInput).toBeTruthy();
  });

  it('should have a submit button', () => {
    const submitButton: DebugElement = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitButton).toBeTruthy();
    expect(submitButton.nativeElement.textContent.trim()).toBe('Submit');
  });

  it('should add "ng-invalid" class when last name is empty', () => {
    const lastNameInput: DebugElement = fixture.debugElement.query(By.css('input[formControlName="lastName"]'));  // Récupérer l'élément de l'input "Last name"
    expect(lastNameInput).toBeTruthy(); // Vérifier que l'élément a été trouvé
    component.form.controls['lastName'].setValue(''); // S'assurer que le champ est vide
    fixture.detectChanges();
    expect(lastNameInput.nativeElement.classList).toContain('ng-invalid'); // Vérifier que la classe "ng-invalid" est bien ajoutée au champ

  });

  it('should set aria-invalid to "true" if email is invalid', fakeAsync(() => {
    const emailInput: DebugElement = fixture.debugElement.query(By.css('input[formControlName="email"]')); // Récupérer l'élément de l'input "email"
    expect(emailInput).toBeTruthy();

    component.form.controls['email'].setValue('testemail.com'); // Définir une valeur incorrecte (sans '@')
    component.form.controls['email'].markAsTouched(); // Marquer le champ comme touché
    fixture.detectChanges();
    flush(); // Attendre toutes les mises à jour Angular

    expect(component.form.controls['email'].invalid).toBeTruthy(); // Vérifier que le champ est invalide
    expect(emailInput.nativeElement.getAttribute('aria-invalid')).toBe('true'); // Vérifier que l'attribut aria-invalid est bien "true"
  }));

  it('should set aria-invalid to "false" if email is valid', fakeAsync(() => {
    const emailInput: DebugElement = fixture.debugElement.query(By.css('input[formControlName="email"]')); // Récupérer l'élément de l'input "email"
    expect(emailInput).toBeTruthy();

    component.form.controls['email'].setValue('test@email.com'); // Définir une valeur correcte (avec '@')
    component.form.controls['email'].markAsTouched(); // Marquer le champ comme touché
    fixture.detectChanges();
    flush(); // Attendre toutes les mises à jour Angular

    expect(component.form.controls['email'].valid).toBeTruthy(); // Vérifier que le champ est valide
    expect(emailInput.nativeElement.getAttribute('aria-invalid')).toBe('false'); // Vérifier que l'attribut aria-invalid est bien "false"
  }));

  it('should enable the submit button when all fields are filled', fakeAsync(() => {
    const submitButton: DebugElement = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitButton).toBeTruthy();

    // Vérifier que le bouton est désactivé au départ
    expect(submitButton.nativeElement.disabled).toBeTruthy();

    // Remplir tous les champs du formulaire
    component.form.controls['firstName'].setValue('Coralie');
    component.form.controls['lastName'].setValue('Haller');
    component.form.controls['email'].setValue('coralie@test.com');
    component.form.controls['password'].setValue('azerty');

    fixture.detectChanges();
    flush(); // Forcer les mises à jour Angular

    // Vérifier que le bouton est maintenant activé
    expect(submitButton.nativeElement.disabled).toBeFalsy();
  }));

  // TESTS D'INTEGRATION

  describe('submit method', () => {

    it('should call authService.register with the correct data', () => {
      const registerRequest = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123'
      };

      component.form.setValue(registerRequest); // Remplir le formulaire
      component.submit(); // Appeler submit

      expect(mockAuthService.register).toHaveBeenCalledWith(registerRequest); // Vérifier l'appel avec les bonnes données
    });

    it('should navigate to /login on successful registration', fakeAsync(() => {
      component.submit();
      tick(); // Simuler l'attente de la navigation
      flush(); // Nettoyer les tâches asynchrones restantes

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']); // Vérifier la navigation
    }));

    it('should set onError to true on registration failure', () => {
      mockAuthService.register.mockReturnValue(throwError(() => new Error('Registration failed'))); // Simuler une erreur
      component.submit();

      expect(component.onError).toBeTruthy(); // Vérifier que l'erreur est bien gérée
    });

  });

});
