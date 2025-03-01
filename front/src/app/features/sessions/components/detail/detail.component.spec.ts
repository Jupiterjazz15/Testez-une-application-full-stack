import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { of } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';
import { DetailComponent } from './detail.component';
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import {ActivatedRoute, Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Session } from '../../interfaces/session.interface';
import { expect } from '@jest/globals';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterTestingModule } from '@angular/router/testing';
import {By} from "@angular/platform-browser";
import {Teacher} from "../../../../interfaces/teacher.interface";


describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let mockSessionService: any;
  let mockSessionApiService: any;
  let mockRouter: any;
  let mockMatSnackBar: any;

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

  const mockTeacher: Teacher = {
    id: 101,
    firstName: 'Nathalie',
    lastName: 'Haller',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-02-01T12:00:00Z'),
  };

  const mockTeacherService = {
    detail: jest.fn().mockReturnValue(of(mockTeacher)),
  };

  mockSessionApiService = {
    delete: jest.fn().mockReturnValue(of({})), // ✅ Mock delete()
    detail: jest.fn().mockReturnValue(of(mockSession)), // ✅ Mock detail()
    participate: jest.fn().mockReturnValue(of({})), // ✅ Mock participate()
    unParticipate: jest.fn().mockReturnValue(of({})), // ✅ Mock unParticipate()
  };

  mockSessionService = {
    sessionInformation: { id: '1', admin: true }, // ✅ Simule un utilisateur admin
  };

  mockRouter = {
    navigate: jest.fn(), // ✅ Simule la navigation
  };

  mockMatSnackBar = {
    open: jest.fn(), // ✅ Mock MatSnackBar
  };

  beforeEach(async () => {
    jest.clearAllMocks()
    jest.spyOn(mockSessionApiService, 'detail').mockReturnValue(of(mockSession)); // ✅ Mock de sessionApiService.detail()
    jest.spyOn(mockTeacherService, 'detail').mockReturnValue(of(mockTeacher)); // ✅ Mock de teacherService.detail()

    await TestBed.configureTestingModule({
      declarations: [DetailComponent],
      providers: [
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter }, // Mock du Router
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => {
                  if (key === 'id') return "1"; // Renvoie une string
                  return null;
                }
              }
            }
          }
        }
      ],
      imports: [
        RouterTestingModule.withRoutes([]), // ✅ Assure un Router correctement défini
        BrowserAnimationsModule, // ✅ Nécessaire pour éviter les erreurs liées à MatSnackBar
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  // TESTS UNITAIRES //

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
    component.isAdmin = false; // Simule un utilisateur non admin
    fixture.detectChanges();

    const deleteButton = fixture.debugElement.query(By.css('[data-testid="delete-button"]'));
    expect(deleteButton).toBeNull();
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

  // TEST D'INTEGRATION //

  describe('ngOnInit method', () => {
    beforeEach(() => {
      jest.spyOn(mockSessionApiService, 'detail').mockReturnValue(of(mockSession)); // ✅ Mock de sessionApiService.detail()
    });

    it('should call fetchSession and retrieve session data', () => {
      component.ngOnInit(); // ✅ Appelle `ngOnInit()`

      expect(mockSessionApiService.detail).toHaveBeenCalledWith('1'); // ✅ Vérifie que l'API a été appelée avec l'ID correct
      expect(component.session).toEqual(mockSession); // ✅ Vérifie que la session a bien été récupérée
    });
  });

  it('should go back when back arrow is clicked', () => {
    const historySpy = jest.spyOn(window.history, 'back'); // ✅ Espionne `window.history.back()`

    const backButton = fixture.debugElement.query(By.css('[data-testid="back-button"]')); // ✅ Utilisation du `data-testid`
    expect(backButton).toBeTruthy(); // ✅ Vérifie que le bouton existe

    backButton.triggerEventHandler('click', null); // ✅ Simule le clic

    expect(historySpy).toHaveBeenCalled(); // ✅ Vérifie que la fonction est bien appelée
  });

  describe('delete method', () => {

    it('should call sessionApiService.delete with the correct session ID', () => {
      component.delete();
      expect(mockSessionApiService.delete).toHaveBeenCalledWith('1');
    });

    it('should open matSnackBar with delete confirmation message', () => {
      component.delete();

      expect(mockMatSnackBar.open).toHaveBeenCalledWith(
        "Session deleted !", "Close", { duration: 3000 }
      );
    });

    it('should navigate to "/sessions" after deleting the session', () => {
      component.delete();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
    });

  });

  describe('participate method', () => {
    beforeEach(() => {
      jest.spyOn(mockSessionApiService, 'participate').mockReturnValue(of({})); // ✅ Mock sessionApiService.participate()
      jest.spyOn(component as any, 'fetchSession').mockImplementation(); // ✅ Mock fetchSession() car privé
    });

    it('should call sessionApiService.participate with the correct sessionId and userId', () => {
      component.participate(); // ✅ Appelle la méthode

      expect(mockSessionApiService.participate).toHaveBeenCalledWith('1', '1'); // ✅ Vérifie les bons paramètres
    });

    it('should call fetchSession after participate()', () => {
      component.participate(); // ✅ Appelle la méthode

      expect(component['fetchSession']).toHaveBeenCalled(); // ✅ Vérifie que fetchSession() est appelée après participate()
    });
  });

  describe('unParticipate method', () => {
    beforeEach(() => {
      jest.spyOn(mockSessionApiService, 'unParticipate').mockReturnValue(of({})); // ✅ Mock de sessionApiService.unParticipate()
      jest.spyOn(component as any, 'fetchSession').mockImplementation(); // ✅ Mock de la méthode privée fetchSession()
    });

    it('should call sessionApiService.unParticipate with correct sessionId and userId', () => {
      component.unParticipate(); // ✅ Appelle la méthode

      expect(mockSessionApiService.unParticipate).toHaveBeenCalledWith('1', '1'); // ✅ Vérifie l'appel avec les bons paramètres
    });

    it('should call fetchSession after unParticipate()', () => {
      component.unParticipate(); // ✅ Appelle la méthode

      expect(component['fetchSession']).toHaveBeenCalled(); // ✅ Vérifie que fetchSession() est appelée après unParticipate()
    });
  });

  describe('fetchSession method', () => {
    beforeEach(() => {
      jest.spyOn(mockSessionApiService, 'detail').mockReturnValue(of(mockSession)); // ✅ Mock sessionApiService.detail()
      jest.spyOn(mockTeacherService, 'detail').mockReturnValue(of(mockTeacher)); // ✅ Mock teacherService.detail()
    });

    it('should call sessionApiService.detail with the correct sessionId', () => {
      (component as any).fetchSession(); // ✅ Appelle la méthode privée

      expect(mockSessionApiService.detail).toHaveBeenCalledWith('1'); // ✅ Vérifie que sessionApiService.detail est bien appelé avec le bon ID
    });

    it('should update session with the data returned by sessionApiService.detail', () => {
      (component as any).fetchSession(); // ✅ Appelle la méthode privée

      expect(component.session).toEqual(mockSession); // ✅ Vérifie que session est bien mis à jour
    });

    it('should update isParticipate based on session users', () => {

      (component as any).fetchSession(); // ✅ Appelle la méthode privée

      expect(component.isParticipate).toBe(true);
    });

    it('should call teacherService.detail with the correct teacher ID', waitForAsync(() => {
      // je dois utiliser waitForAsync car fakeAsync ne fonctionne pas
      (component as any).fetchSession(); // Appelle la méthode privée

      fixture.whenStable().then(() => {
        expect(mockTeacherService.detail).toHaveBeenCalledWith(mockSession.teacher_id); // Vérifie que teacherService.detail() est bien appelé
      });
    }));

    it('should update teacher with the data returned by teacherService.detail', waitForAsync(() => {
      // je dois utiliser waitForAsync car fakeAsync ne fonctionne pas
      (component as any).fetchSession(); //  Appelle la méthode privée

      fixture.whenStable().then(() => {
        expect(component.teacher).toEqual(mockTeacher); //  Vérifie que teacher est bien mis à jour
      });
    }));

  });

});
