import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { expect } from '@jest/globals';
import { AuthService } from '../../services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { NgZone, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SessionInformation } from '../../../../interfaces/sessionInformation.interface';
import { LoginComponent } from './login.component';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let sessionService: SessionService;
  let router: Router;
  let ngZone: NgZone;

  const mockRouter = {
    navigate: jest.fn(),
  };

  const mockSessionService: { sessionInformation: { token?: string | null } | null, logIn: jest.Mock } = {
    sessionInformation: null,
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
    jest.resetAllMocks();
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: { login: jest.fn().mockReturnValue(of(mockSessionInfo)) } },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter },
        FormBuilder
      ],
      imports: [
        RouterTestingModule.withRoutes([{ path: 'sessions', component: LoginComponent }]),
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    ngZone = TestBed.inject(NgZone);
    fixture.detectChanges();
  });

  // TESTS UNITAIRES

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a mat-card-title with text "Login"', () => {
    const title: DebugElement = fixture.debugElement.query(By.css('.mat-card-title'));
    expect(title).toBeTruthy();
    expect(title.nativeElement.textContent.trim()).toBe('Login');
  });

  it('should contain an email input field', () => {
    const emailInput = fixture.debugElement.query(By.css('input[formControlName="email"]'));
    expect(emailInput).toBeTruthy();
  });

  it('should contain a password input field', () => {
    const passwordInput = fixture.debugElement.query(By.css('input[formControlName="password"]'));
    expect(passwordInput).toBeTruthy();
  });

  it('should set aria-invalid="false" when the password is not empty', () => {
    const passwordInput = fixture.debugElement.query(By.css('input[formControlName="password"]'));
    component.form.controls['password'].setValue('');
    fixture.detectChanges();
    expect(passwordInput.nativeElement.getAttribute('aria-invalid')).toBeNull();
  });

  it('should have the class ng-invalid if password is empty', () => {
    const passwordInput = fixture.debugElement.query(By.css('input[formControlName="password"]'));
    component.form.controls['password'].setValue('');
    fixture.detectChanges();
    expect(passwordInput.nativeElement.classList).toContain('ng-invalid');
  });

  it('should contain a button with text "Submit"', () => {
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitButton).toBeTruthy();
    expect(submitButton.nativeElement.textContent.trim()).toBe('Submit');
  });

  it('should enable the submit button when form is valid', () => {
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    component.form.controls['email'].setValue('test@email.com');
    component.form.controls['password'].setValue('StrongPassword123');
    fixture.detectChanges();
    expect(submitButton.nativeElement.disabled).toBeFalsy();
  });

  // TESTS D'INTEGRATION

  describe('ngOnInit method', () => {
    it('should navigate to "/sessions" if sessionInformation token is valid', () => {
      mockSessionService.sessionInformation = { token: 'validToken' };
      component.ngOnInit();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
    });
  });

  describe('submit method', () => {
    it('should call authService.login with form values', () => {
      const loginRequest = { email: 'test@example.com', password: 'password' };
      component.form.setValue(loginRequest);
      component.submit();
      expect(authService.login).toHaveBeenCalledWith(loginRequest);
    });

    it('should call sessionService.logIn and navigate on successful login', () => {
      const sessionSpy = jest.spyOn(mockSessionService, 'logIn');
      component.submit();
      expect(sessionSpy).toHaveBeenCalledWith(mockSessionInfo);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
    });

    it('should set onError to true if login fails', () => {
      jest.spyOn(authService, 'login').mockReturnValue(throwError(() => new Error('Invalid credentials')));
      component.submit();
      expect(component.onError).toBeTruthy();
    });
  });
});
