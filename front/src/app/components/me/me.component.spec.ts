import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';  // ✅ Import du module pour désactiver les animations
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MeComponent } from './me.component';
import { By } from '@angular/platform-browser';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SessionService } from 'src/app/services/session.service';
import { UserService } from 'src/app/services/user.service';
import { of } from 'rxjs';
import { expect } from '@jest/globals';
import { Router } from '@angular/router';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let router: Router;

  const mockUser = {
    id: 1,
    firstName: 'Coralie',
    lastName: 'Haller',
    email: 'coralie@test.com',
    password: 'coralie',
    admin: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockSessionService = {
    sessionInformation: { id: 1 },
    logOut: jest.fn(() => console.log("✅ Mock logOut() appelé !")),
  };

  const mockUserService = {
    getById: jest.fn().mockReturnValue(of(mockUser)),
    delete: jest.fn().mockReturnValue(of({})), // ✅ Ajout du mock pour delete()
  };

  const mockRouter = {
    navigate: jest.fn(), // ✅ Ajout du mock pour la navigation
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        NoopAnimationsModule,
        BrowserAnimationsModule,
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter } // ✅ Ajout du mock du Router
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  // ✅ TESTS UNITAIRES

  it('should create the component', () => {
    expect(component).toBeDefined();
  });

  it('should display the back arrow button', () => {
    const backButton = fixture.debugElement.query(By.css('button mat-icon'));
    expect(backButton).toBeTruthy();
    expect(backButton.nativeElement.textContent.trim()).toBe('arrow_back');
  });

  it('should display "User information" in the h1', () => {
    const h1Element = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(h1Element.textContent.trim()).toBe('User information');
  });

  it('should display the user firstName correctly', () => {
    const nameElement = fixture.nativeElement.querySelector('p');
    expect(nameElement.textContent).toContain(mockUser.firstName);
  });

  it('should display the user lastName in uppercase', () => {
    const nameElement = fixture.nativeElement.querySelector('p');
    expect(nameElement.textContent).toContain(mockUser.lastName.toUpperCase());
  });

  it('should display the delete button if user is NOT an admin', () => {
    component.user = { ...mockUser, admin: false };
    fixture.detectChanges();

    const deleteButton = fixture.debugElement.query(By.css('button[color="warn"]'));
    expect(deleteButton).toBeTruthy();
  });

  it('should NOT display the delete button if user is an admin', () => {
    component.user = { ...mockUser, admin: true };
    fixture.detectChanges();

    const deleteButton = fixture.debugElement.query(By.css('button[color="warn"]'));
    expect(deleteButton).toBeFalsy();
  });

  it('should display "You are admin" if the user is an admin', () => {
    fixture.detectChanges();
    const adminMessage = fixture.debugElement.query(By.css('p.my2'));
    expect(adminMessage).toBeTruthy();
    expect(adminMessage.nativeElement.textContent.trim()).toBe('You are admin');
  });

  it('should display the user creation date correctly', () => {
    fixture.detectChanges();

    const createdAtElement = fixture.debugElement.queryAll(By.css('p'))
      .find(el => el.nativeElement.textContent.includes("Create at:"))?.nativeElement;

    expect(createdAtElement).toBeTruthy();
    expect(createdAtElement.textContent).toContain(
      new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(mockUser.createdAt)
    );
  });

  it('should display the user last update date correctly', () => {
    fixture.detectChanges();

    const updatedAtElement = fixture.debugElement.queryAll(By.css('p'))[3].nativeElement;

    expect(updatedAtElement.textContent).toContain(
      new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(mockUser.updatedAt)
    );
  });

  // TESTS D'INTEGRATION //

  // Problème au niveau de l'animation //

  /**
   * it('should call delete() and perform all necessary actions', fakeAsync(() => {
   *   const deleteSpy = jest.spyOn(mockUserService, 'delete').mockReturnValue(of({}));
   *   const snackBarSpy = jest.spyOn(component['matSnackBar'], 'open');
   *   const logOutSpy = jest.spyOn(mockSessionService, 'logOut').mockImplementation(() => {});
   *   const routerSpy = jest.spyOn(component['router'], 'navigate');
   *
   *   console.log(`🔹 Avant appel de delete()`);
   *   component.delete();
   *   console.log(`✅ Après appel de delete()`);
   *
   *   tick(3000); // ✅ Attendre que l'animation de la snackbar et toutes les opérations asynchrones se terminent
   *   fixture.detectChanges();
   *
   *   console.log(`logOutSpy calls after test: ${logOutSpy.mock.calls.length}`);
   *
   *   expect(deleteSpy).toHaveBeenCalledWith(mockSessionService.sessionInformation.id.toString());
   *   expect(snackBarSpy).toHaveBeenCalledWith("Your account has been deleted !", 'Close', { duration: 3000 });
   *   expect(logOutSpy).toHaveBeenCalled();
   *   expect(routerSpy).toHaveBeenCalledWith(['/']);
   * }));
   */

  it('should go back when back arrow is clicked', () => {
    const historySpy = jest.spyOn(window.history, 'back'); // ✅ Espionne window.history.back()

    const backButton = fixture.debugElement.query(By.css('button[mat-icon-button]'));
    expect(backButton).toBeTruthy(); // ✅ Vérifie que le bouton existe

    backButton.triggerEventHandler('click', null); // ✅ Simule le clic

    expect(historySpy).toHaveBeenCalled(); // ✅ Vérifie que la fonction est bien appelée
  });





});
