import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from "@angular/router";

describe('LoginComponent', () => {
  let sessionService: SessionService;
  let mockAuthService: any;
  let router: Router;
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let routerSpy: jest.SpyInstance;
  let authServiceSpy: jest.SpyInstance;
  let sessionServiceSpy: jest.SpyInstance;

  beforeEach(async () => {
    // ✅ Réinitialisation des mocks avant chaque test
    jest.resetAllMocks();
    jest.clearAllMocks();

    // ✅ Définition des valeurs mockées
    mockAuthService = {
      login: jest.fn().mockReturnValue(of(mockSessionInfo)), // ✅ Mock de la réponse
      register: jest.fn().mockReturnValue(of({})),
    };

    mockSessionService.sessionInformation = { token: 'validToken' }; // ✅ Simule un utilisateur connecté
    mockRouter.navigate = jest.fn(); // ✅ Simule la navigation

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter },
        FormBuilder, // ✅ Ajout de FormBuilder pour éviter l'erreur `No provider for FormBuilder!`
      ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    fixture.detectChanges();

    // ✅ Espionner les méthodes après l'initialisation des services
    routerSpy = jest.spyOn(mockRouter, 'navigate');
    authServiceSpy = jest.spyOn(mockAuthService, 'login');
  });


  const mockRouter = {
    navigate: jest.fn(),
  };

  const mockSessionService: { sessionInformation: { token?: string | null } | null, logIn: jest.Mock } = {
    sessionInformation: null, // ✅ Initialisé à null, mais peut aussi être un objet avec `token`
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



  //TESTS UNITAIRES//

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

  //  TESTS D'INTEGRATION

  describe('ngOnInit method', () => {

    beforeEach(() => {
      mockRouter.navigate = jest.fn(); // ✅ Modification correcte
      routerSpy = jest.spyOn(mockRouter, 'navigate'); // ✅ Espionne la navigation
    });

    // Je dois remettre un beforeEach ici, car mockSessionService.sessionInformation = { token: 'validToken' }; du beforeEach globale pose problème pour le test
    // 'should NOT navigate if sessionService.sessionInformation is null'

    it('should navigate to "/sessions" if sessionService.sessionInformation token is valid', () => {
      mockSessionService.sessionInformation = { token: 'validToken' }; // ✅ Modification correcte

      component.ngOnInit(); // ✅ Appel de la méthode

      expect(routerSpy).toHaveBeenCalledWith(['/sessions']); // ✅ Vérifie la redirection
    });

    it('should NOT navigate if sessionService.sessionInformation is null', () => {
      mockSessionService.sessionInformation = null; // ✅ Modification correcte

      component.ngOnInit();

      expect(routerSpy).not.toHaveBeenCalled(); // ✅ Vérifie qu'il n'y a pas eu de redirection
    });


  });

  describe('submit method', () => {

    it('should call authService.login with form values', () => {
      const loginRequest = { email: 'test@example.com', password: 'password' };
      component.form.setValue(loginRequest);

      component.submit(); // ✅ Appel de la méthode

      expect(authServiceSpy).toHaveBeenCalledWith(loginRequest);
    });

    it('should call sessionService.logIn and navigate on successful login', () => {
      const mockResponse = { token: 'validToken' };
      authServiceSpy.mockReturnValue(of(mockResponse)); // ✅ Simule une réponse de connexion

      const sessionSpy = jest.spyOn(mockSessionService, 'logIn');

      component.submit();

      expect(sessionSpy).toHaveBeenCalledWith(mockResponse);
      expect(routerSpy).toHaveBeenCalledWith(['/sessions']);
    });

    it('should set onError to true if login fails', () => {
      authServiceSpy.mockReturnValue(throwError(() => new Error('Invalid credentials')));

      component.submit();

      expect(component.onError).toBeTruthy();
    });
  });

});
