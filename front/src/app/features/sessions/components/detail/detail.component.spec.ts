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

    // 🔹 Définir les valeurs par défaut pour éviter de les répéter dans chaque test
    component.session = {
      id: 1,
      name: 'Yoga Session',
      description: 'A relaxing yoga session for beginners.',
      date: new Date('2025-02-10'),
      teacher_id: 1, // Par défaut, un professeur est assigné
      users: [1, 2, 3,4],
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-02-01')
    };

    component.teacher = {
      id: 1,
      firstName: 'John',
      lastName: 'DOE',
      createdAt: new Date(),
      updatedAt: new Date()
    };

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
    expect(deleteButton).toBeNull();
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

  it('should call participate() when Participate button is clicked', () => {
    component.isParticipate = false; // Simuler que l'utilisateur ne participe pas encore
    component.isAdmin = false; // S'assurer qu'il n'est pas admin
    fixture.detectChanges();

    // ✅ Vérifier si le bouton existe avant d'espionner la méthode
    const participateButton = fixture.debugElement.query(By.css('button[mat-raised-button]'));
    expect(participateButton).toBeTruthy(); // Vérifier que le bouton est bien affiché

    jest.spyOn(component, 'participate'); // Espionner la méthode `participate`
    participateButton.triggerEventHandler('click', null); // Simuler le clic

    expect(component.participate).toHaveBeenCalled(); // Vérifier que `participate()` a bien été appelé
  });

  it('should call unParticipate() when Do not participate button is clicked', () => {
    component.isParticipate = true; // Simuler que l'utilisateur participe déjà
    component.isAdmin = false; // S'assurer qu'il n'est pas admin
    fixture.detectChanges();

    // ✅ Vérifier si le bouton existe avant d'espionner la méthode
    const unParticipateButton = fixture.debugElement.query(By.css('button[mat-raised-button]'));
    expect(unParticipateButton).toBeTruthy(); // Vérifier que le bouton est bien affiché

    jest.spyOn(component, 'unParticipate'); // Espionner la méthode `unParticipate`
    unParticipateButton.triggerEventHandler('click', null); // Simuler le clic

    expect(component.unParticipate).toHaveBeenCalled(); // Vérifier que `unParticipate()` a bien été appelé
  });

  it('should display the "Participate" button if the user is not a participant', () => {
    // ✅ Simuler une session où l'utilisateur n'est pas un participant
    component.session = {
      id: 1,
      name: 'Yoga Session',
      description: 'A relaxing yoga class',
      date: new Date(),
      teacher_id: 2,
      users: [], // ✅ Aucun participant
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Session;

    component.isParticipate = false; // ✅ L'utilisateur n'est PAS participant
    component.isAdmin = false; // ✅ L'utilisateur n'est PAS admin
    fixture.detectChanges();

    // ✅ Correction du sélecteur CSS pour trouver le bon bouton
    const participateButton = fixture.debugElement.query(By.css('button[mat-raised-button]'));

    expect(participateButton).toBeTruthy();
    expect(participateButton.nativeElement.textContent.trim()).toContain('Participate');
  });

  it('should display the "Do not participate" button if the user is a participant and not an admin', () => {
    // ✅ Simuler une session avec des données valides
    component.session = {
      id: 1,
      name: 'Yoga Session',
      description: 'A relaxing yoga class',
      date: new Date(),
      teacher_id: 2,
      users: [1], // ✅ L'utilisateur est déjà participant
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Session;

    // ✅ Conditions nécessaires pour que le bouton "Do not participate" apparaisse
    component.isParticipate = true;  // ✅ L'utilisateur PARTICIPE déjà
    component.isAdmin = false;       // ✅ L'utilisateur N'EST PAS admin
    fixture.detectChanges();

    // ✅ Sélectionner le bouton "Do not participate"
    const doNotParticipateButton = fixture.debugElement.query(By.css('button[mat-raised-button]'));

    expect(doNotParticipateButton).toBeTruthy(); // ✅ Vérifier qu'il existe
    expect(doNotParticipateButton.nativeElement.textContent.trim()).toContain('Do not participate'); // ✅ Vérifier le texte
  });

  it('should display the teacher\'s name if a teacher is assigned', () => {
    // Simuler un professeur complet
    component.teacher = {
      id: 1,
      firstName: 'John',
      lastName: 'DOE',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    fixture.detectChanges();

    // Récupérer l'élément affichant le nom du professeur
    const teacherElement = fixture.debugElement.query(By.css('mat-card-subtitle'));

    expect(teacherElement).toBeTruthy();
    expect(teacherElement.nativeElement.textContent).toContain('John DOE');
  });

  it('should display the number of participants if a teacher is assigned', () => {
    // Simuler une session avec un professeur et 3 participants
    component.session = {
      id: 1,
      name: 'Yoga Session',
      description: 'A relaxing yoga session',
      date: new Date(),
      teacher_id: 1, // Présence d'un professeur
      users: [1, 2, 3], // 3 participants
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Simuler la présence d'un professeur
    component.teacher = {
      id: 1,
      firstName: 'John',
      lastName: 'DOE',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    fixture.detectChanges();

    // Sélectionner l'élément affichant le nombre de participants
    const participantsElement = fixture.debugElement.query(By.css('mat-card-content div:first-of-type span.ml1'));

    // Vérifications
    expect(participantsElement).toBeTruthy(); // Vérifier que l'élément existe
    expect(participantsElement.nativeElement.textContent.trim()).toBe('3 attendees'); // Vérifier que le nombre affiché est correct
  });

  it('should display the session date if a teacher is assigned', () => {
    // Simuler une session avec un professeur
    component.session = {
      id: 1,
      name: 'Yoga Session',
      description: 'A relaxing yoga session',
      date: new Date('2025-02-10'),
      teacher_id: 1, // Un professeur est assigné
      users: [1, 2, 3],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Simuler la présence d'un professeur
    component.teacher = {
      id: 1,
      firstName: 'John',
      lastName: 'DOE',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    fixture.detectChanges();

    // Sélectionner l'élément affichant la date de la session
    const dateElement = fixture.debugElement.query(By.css('.my2 div:nth-child(2) span'));

    // Vérifications
    expect(dateElement).toBeTruthy(); // Vérifier que l'élément existe
    expect(dateElement.nativeElement.textContent).toContain('February 10, 2025'); // Vérifier que la date est bien affichée
  });

  it('should display the session description if a teacher is assigned', () => {
    // Simuler une session avec un professeur
    component.session = {
      id: 1,
      name: 'Yoga Session',
      description: 'A relaxing yoga session for beginners.',
      date: new Date('2025-02-10'),
      teacher_id: 1, // Un professeur est assigné
      users: [1, 2, 3],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Simuler la présence d'un professeur
    component.teacher = {
      id: 1,
      firstName: 'John',
      lastName: 'DOE',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    fixture.detectChanges();

    // Sélectionner l'élément affichant la description
    const descriptionElement = fixture.debugElement.query(By.css('.description'));

    // Vérifications
    expect(descriptionElement).toBeTruthy(); // Vérifier que l'élément existe
    expect(descriptionElement.nativeElement.textContent).toContain('A relaxing yoga session for beginners.'); // Vérifier que la description est bien affichée
  });

  it('should display the session createdAt date if a teacher is assigned', () => {
    // Simuler une session avec un professeur
    component.session = {
      id: 1,
      name: 'Yoga Session',
      description: 'A relaxing yoga session for beginners.',
      date: new Date('2025-02-10'),
      teacher_id: 1, // Un professeur est assigné
      users: [1, 2, 3],
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-02-01')
    };

    // Simuler la présence d'un professeur
    component.teacher = {
      id: 1,
      firstName: 'John',
      lastName: 'DOE',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    fixture.detectChanges();

    // Sélectionner l'élément affichant la date de création
    const createdAtElement = fixture.debugElement.query(By.css('.created'));

    // Vérifications
    expect(createdAtElement).toBeTruthy(); // Vérifier que l'élément existe
    expect(createdAtElement.nativeElement.textContent).toContain('January 1, 2025'); // Vérifier que la date est bien affichée
  });

  it('should display the session updatedAt date if a teacher is assigned', () => {
    // Simuler une session avec un professeur
    component.session = {
      id: 1,
      name: 'Yoga Session',
      description: 'A relaxing yoga session for beginners.',
      date: new Date('2025-02-10'),
      teacher_id: 1, // Un professeur est assigné
      users: [1, 2, 3],
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-02-01')
    };

    // Simuler la présence d'un professeur
    component.teacher = {
      id: 1,
      firstName: 'John',
      lastName: 'DOE',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    fixture.detectChanges();

    // Sélectionner l'élément affichant la date de mise à jour
    const updatedAtElement = fixture.debugElement.query(By.css('.updated'));

    // Vérifications
    expect(updatedAtElement).toBeTruthy(); // Vérifier que l'élément existe
    expect(updatedAtElement.nativeElement.textContent).toContain('February 1, 2025'); // Vérifier que la date est bien affichée
  });


});
