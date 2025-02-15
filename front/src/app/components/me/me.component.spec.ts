import { ComponentFixture, TestBed } from '@angular/core/testing';
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

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;

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
    sessionInformation: {
      id: 1
    }
  };

  const mockUserService = {
    getById: jest.fn().mockReturnValue(of(mockUser))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: mockUserService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

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
    component.user = { ...mockUser, admin: false }; // Modifier l'état mocké
    fixture.detectChanges(); // Mettre à jour le DOM

    const deleteButton = fixture.debugElement.query(By.css('button[color="warn"]'));
    expect(deleteButton).toBeTruthy(); // Vérifie que le bouton existe
  });

  it('should NOT display the delete button if user is an admin', () => {
    component.user = { ...mockUser, admin: true }; // Modifier l'état mocké
    fixture.detectChanges(); // Mettre à jour le DOM

    const deleteButton = fixture.debugElement.query(By.css('button[color="warn"]'));
    expect(deleteButton).toBeFalsy(); // Vérifie que le bouton n'existe pas
  });

  it('should display "You are admin" if the user is an admin', () => {
    fixture.detectChanges();
    const adminMessage = fixture.debugElement.query(By.css('p.my2'));
    expect(adminMessage).toBeTruthy();
    expect(adminMessage.nativeElement.textContent.trim()).toBe('You are admin');
  });

  it('should display the user creation date correctly', () => {
    fixture.detectChanges(); // Mettre à jour le DOM

    // Trouver l'élément qui contient "Create at:"
    const createdAtElement = fixture.debugElement.queryAll(By.css('p'))
      .find(el => el.nativeElement.textContent.includes("Create at:"))?.nativeElement;

    expect(createdAtElement).toBeTruthy(); // Vérifie que l'élément existe avant d'accéder à son contenu

    expect(createdAtElement.textContent).toContain(
      new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(mockUser.createdAt)
    );
  });

  it('should display the user last update date correctly', () => {
    fixture.detectChanges(); // Mettre à jour le DOM

    // Sélectionner le dernier paragraphe contenant "Last update:"
    const updatedAtElement = fixture.debugElement.queryAll(By.css('p'))[3].nativeElement;

    expect(updatedAtElement.textContent).toContain(
      new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(mockUser.updatedAt)
    );
  });

});
