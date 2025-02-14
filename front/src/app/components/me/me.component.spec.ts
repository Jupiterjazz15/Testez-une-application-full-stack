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
    firstName: 'Coralie',
    lastName: 'Haller',
    email: 'coralie@test.com',
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

  it('should display "User information" in the h1', () => {
    const h1Element = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(h1Element.textContent.trim()).toBe('User information');
  });

  it('should display the user firstName correctly', () => {
    fixture.detectChanges(); // Mettre à jour le DOM

    const nameElement = fixture.nativeElement.querySelector('p');
    expect(nameElement.textContent).toContain(mockUser.firstName);
  });

  it('should display the user lastName correctly', () => {
    fixture.detectChanges(); // Mettre à jour le DOM

    const nameElement = fixture.nativeElement.querySelector('p');
    expect(nameElement.textContent).toContain(mockUser.lastName.toUpperCase()); // Last name est affiché en majuscules
  });

  it('should display the user lastName correctly', () => {
    fixture.detectChanges(); // Mettre à jour le DOM

    const nameElement = fixture.nativeElement.querySelector('p');
    expect(nameElement.textContent).toContain(mockUser.lastName.toUpperCase()); // Last name est affiché en majuscules
  });

  
});
