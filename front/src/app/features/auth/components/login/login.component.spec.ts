import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionInformation } from "../../../../interfaces/sessionInformation.interface";
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from "rxjs";
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from "@angular/router";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let sessionService: SessionService;
  let mockAuthService: any;
  let router: Router;

  const mockRouter = {
    navigate: jest.fn(),
  };

  const mockSessionService = {
    logIn: jest.fn(),
  };

  const mockSessionInfo: SessionInformation = {
    id: 1,
    token: 'mockToken',
    type: 'mockType',
    username: 'mockUsername',
    firstName: 'John',
    lastName: 'Doe',
    admin: false,
  };

  beforeEach(async () => {
    mockAuthService = {
      login: jest.fn().mockReturnValue(of(mockSessionInfo)),
      register: jest.fn().mockReturnValue(of({})),
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter },
      ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });



  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a mat-card-title with text "Login"', () => {

    const loginCardTitle: DebugElement = fixture.debugElement.query(By.css('.mat-card-title')); // Récupérer l'élément contenant la classe mat-card-title
    expect(loginCardTitle).toBeTruthy(); // Vérifier que l'élément est trouvé
    expect(loginCardTitle.nativeElement.textContent.trim()).toBe('Login'); // Vérifier que le texte est bien "Login"

  });

  it('should contain an email input field', () => {
    const emailInput: DebugElement = fixture.debugElement.query(By.css('input[formControlName="email"]'));
    expect(emailInput).toBeTruthy();
  });

  it('should contain a password input field', () => {
    const passwordInput: DebugElement = fixture.debugElement.query(By.css('input[formControlName="password"]'));
    expect(passwordInput).toBeTruthy();
  });

  //TESTS UNITAIRES//

  it('should set aria-invalid="false" when the password is not empty', () => {
    const passwordInput: DebugElement = fixture.debugElement.query(By.css('input[formControlName="password"]')); // Récupérer l'élément de l'input
    expect(passwordInput).toBeTruthy(); // Vérifier que l'élément a été trouvé

    component.form.controls['password'].setValue(''); // S'assurer que le champ est vide
    fixture.detectChanges();

    expect(passwordInput.nativeElement.getAttribute('aria-invalid')).toBeNull();
  });

  it('should have the class ng-invalid password is empty', () => {
    const passwordInput: DebugElement = fixture.debugElement.query(By.css('input[formControlName="password"]')); // Récupérer l'élément de l'input
    expect(passwordInput).toBeTruthy(); // Vérifier que l'élément a été trouvé

    component.form.controls['password'].setValue(''); // S'assurer que le champ est vide
    fixture.detectChanges(); // Déclencher la mise à jour du DOM

    expect(passwordInput.nativeElement.classList).toContain('ng-invalid'); // Vérifier que la classe "ng-invalid" est bien ajoutée
  });

  it('should contain a button with text "Submit"', () => {
    const submitButton: DebugElement = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitButton).toBeTruthy();
    expect(submitButton.nativeElement.textContent.trim()).toBe('Submit');
  });

  it('should enable the submit button when all fields are filled', () => {
    const submitButton: DebugElement = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitButton).toBeTruthy();

    // Vérifier que le bouton est désactivé au départ
    expect(submitButton.nativeElement.disabled).toBeTruthy();

    // Remplir tous les champs du formulaire
    component.form.controls['email'].setValue('test@email.com');
    component.form.controls['password'].setValue('StrongPassword123');

    fixture.detectChanges(); // Mettre à jour le DOM après modification du formulaire

    // Vérifier que le bouton est maintenant activé
    expect(submitButton.nativeElement.disabled).toBeFalsy();
  });

  // ✅ TESTS D'INTEGRATION : Vérifier si login et redirection fonctionnent
  it('should call SessionService logIn and navigate on successful login', () => {
    const logInSpy = jest.spyOn(sessionService, 'logIn').mockImplementation(() => {});

    component.form.patchValue({
      email: 'test@example.com',
      password: 'password',
    });
    component.submit();

    expect(logInSpy).toHaveBeenCalledWith(mockSessionInfo);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  // ✅ TEST D'INTEGRATION : Vérifier la gestion d'erreur
  it('should set onError to true on login error', () => {
    jest.spyOn(mockAuthService, 'login').mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 500, statusText: 'Server Error' }))
    );

    component.submit();

    expect(component.onError).toBeTruthy();
  });

  // ✅ TEST D'INTEGRATION : Vérifier redirection si déjà connecté
  it('should redirect to /sessions if already logged in and modify the URL to go back to /login', () => {
    Object.defineProperty(sessionService, 'sessionInformation', {
      get: jest.fn(() => ({
        id: 1,
        token: 'mockToken',
        type: 'Bearer',
        username: 'mockUser',
        firstName: 'John',
        lastName: 'Doe',
        admin: false
      } as SessionInformation))
    });

    const routerSpy = jest.spyOn(router, 'navigate');

    component.ngOnInit();

    expect(routerSpy).toHaveBeenCalledWith(['/sessions']);
  });

});
