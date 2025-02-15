import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { By } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionService } from './services/session.service';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { expect } from '@jest/globals';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  const mockSessionService = {
    $isLogged: jest.fn(),
    logOut: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        MatToolbarModule,
        RouterTestingModule,
        HttpClientModule // Ajouté pour éviter l'erreur d'injection
      ],
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeDefined();
  });

  it('should display the app title', () => {
    fixture.detectChanges();

    const titleDebugElement = fixture.debugElement.query(By.css('mat-toolbar span'));
    expect(titleDebugElement).toBeTruthy(); // Vérifie que l'élément est bien présent

    if (titleDebugElement) {
      const titleElement = titleDebugElement.nativeElement;
      expect(titleElement.textContent.trim()).toBe('Yoga app'); // Titre correspondant au HTML fourni
    }
  });

  it('should display the login button if user is not logged in', () => {
    mockSessionService.$isLogged.mockReturnValue(of(false));
    fixture.detectChanges();

    const loginButton = fixture.debugElement.query(By.css('span.link[routerLink="login"]'));
    expect(loginButton).toBeTruthy();
    expect(loginButton.nativeElement.textContent.trim()).toBe('Login');
  });

  it('should display the register button if user is not logged in', () => {
    mockSessionService.$isLogged.mockReturnValue(of(false));
    fixture.detectChanges();

    const registerButton = fixture.debugElement.query(By.css('span.link[routerLink="register"]'));
    expect(registerButton).toBeTruthy();
    expect(registerButton.nativeElement.textContent.trim()).toBe('Register');
  });

  it('should display the logout button if user is logged in', () => {
    mockSessionService.$isLogged.mockReturnValue(of(true));
    fixture.detectChanges();

    const logoutButton = fixture.debugElement.query(By.css('span.link:last-of-type')); // Sélectionne le dernier lien qui doit être "Logout"
    expect(logoutButton).toBeTruthy();
    expect(logoutButton.nativeElement.textContent.trim()).toBe('Logout');
  });

  it('should call logOut method when logout button is clicked', () => {
    mockSessionService.$isLogged.mockReturnValue(of(true));
    fixture.detectChanges();

    const logoutButton = fixture.debugElement.query(By.css('span.link:last-of-type'));
    expect(logoutButton).toBeTruthy(); // Vérifie que le bouton Logout existe

    if (logoutButton) {
      logoutButton.nativeElement.click(); // Simule un clic sur le bouton Logout
      fixture.detectChanges();
      expect(mockSessionService.logOut).toHaveBeenCalled(); // Correction ici
    }
  });

});
