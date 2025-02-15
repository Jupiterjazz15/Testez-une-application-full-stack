import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { Session } from '../../interfaces/session.interface';

import { DetailComponent } from './detail.component';


describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let service: SessionService;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule
      ],
      declarations: [DetailComponent],
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    }).compileComponents();

    service = TestBed.inject(SessionService);
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    component.session = mockSession;   // 🔹 Injecter les données avant chaque test
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a back arrow button', () => {
    const backButton = fixture.debugElement.query(By.css('button mat-icon'));

    expect(backButton).toBeTruthy();
    expect(backButton.nativeElement.textContent.trim()).toBe('arrow_back');
  });


  it('should display the session name correctly', () => {
    const nameElement = fixture.nativeElement.querySelector('h1');
    expect(nameElement.textContent).toContain(mockSession.name);
  });

  it('should display the session date correctly', () => {
    const dateElement = fixture.nativeElement.querySelector('.my2 div:nth-child(2) span');
    expect(dateElement.textContent).toContain('February 10, 2025');
  });

  it('should display the number of attendees correctly', () => {
    const attendeesElement = fixture.nativeElement.querySelector('.my2 div:nth-child(1) span');
    expect(attendeesElement.textContent).toContain(mockSession.users.length.toString());
  });

  it('should display the Delete button if the user is an admin', () => {
    component.isAdmin = true; // Simuler un admin
    fixture.detectChanges(); // Mettre à jour le DOM

    const deleteButton = fixture.nativeElement.querySelector('button[color="warn"]');
    expect(deleteButton).toBeTruthy();
    expect(deleteButton.textContent).toContain('Delete');
  });

  it('should not display the Delete button if the user is not an admin', () => {
    component.isAdmin = false; // Simuler un utilisateur non-admin
    fixture.detectChanges();

    const deleteButton = fixture.nativeElement.querySelector('button[color="warn"]');
    expect(deleteButton).toBeFalsy();
  });

  it('should call delete() when Delete button is clicked', () => {
    // ✅ Simuler un admin pour voir le bouton Delete
    component.isAdmin = true;
    fixture.detectChanges();

    // ✅ Espionner la méthode `delete()`
    jest.spyOn(component, 'delete');

    // ✅ Trouver et cliquer sur le bouton Delete
    const deleteButton = fixture.debugElement.query(By.css('button[color="warn"]'));
    deleteButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    // ✅ Vérifier que `delete()` a bien été appelée
    expect(component.delete).toHaveBeenCalled();
  });

  it('should display the "Participate" button if the user is not a participant', () => {
    // Simuler une session où l'utilisateur n'est pas participant
    component.session = {
      users: [] // L'utilisateur courant n'est pas dans la liste
    } as Session;

    component.isParticipate = false; // Forcer isParticipate à false
    fixture.detectChanges();

    const participateButton = fixture.debugElement.query(By.css('button.participate-btn'));

    expect(participateButton).toBeTruthy();
    expect(participateButton.nativeElement.textContent.trim()).toBe('Participate');
  });


});
