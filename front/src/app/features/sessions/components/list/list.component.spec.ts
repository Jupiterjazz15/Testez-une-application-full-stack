import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { expect } from '@jest/globals';
import { Session } from '../../interfaces/session.interface';
import { SessionService } from 'src/app/services/session.service';
import { ListComponent } from './list.component';

describe('ListComponent', () => {
  let component: ListComponent; // Instance du composant
  let fixture: ComponentFixture<ListComponent>; // Fixture pour interagir avec le composant
  let mockSessionSubject: BehaviorSubject<Session[]>; // Simule les sessions
  let mockSessionService: Partial<SessionService>; // Service mocké

  // Définition des sessions mockées
  const mockSessions: Session[] = [
    { id: 1, name: 'Session 1', date: new Date(), description: 'Yoga beginner', teacher_id: 101, users: [1, 2, 3], createdAt: new Date(), updatedAt: new Date() },
    { id: 2, name: 'Session 2', date: new Date(), description: 'Advanced yoga', teacher_id: 102, users: [4, 5], createdAt: new Date(), updatedAt: new Date() }
  ];

  beforeEach(async () => {
    // Simulation d'un BehaviorSubject pour `sessions$`
    mockSessionSubject = new BehaviorSubject<Session[]>([]); // Commence vide
    console.log('📌 Sessions avant push:', mockSessionSubject.getValue()); // 🔍 Vérifier l'état initial

    const mockSessionService = {
      sessionInformation: {
        token: 'mock-token',
        type: 'Bearer',
        id: 1,
        username: 'testUser',
        firstName: 'Test',
        lastName: 'User',
        admin: true
      },
      sessions$: mockSessionSubject.asObservable()
    } as unknown as SessionService;

    await TestBed.configureTestingModule({
      declarations: [ListComponent], // Déclaration du composant à tester
      imports: [HttpClientTestingModule, MatCardModule, MatIconModule], // Mock HTTP complet
      providers: [{ provide: SessionService, useValue: mockSessionService }]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Simuler l'envoi des sessions après l'initialisation
    mockSessionSubject.next(mockSessions);
    console.log('📌 Sessions après push:', mockSessionSubject.getValue()); // 🔍 Vérifier l'état après push
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the "Create" button if the user is an admin', () => {
    fixture.detectChanges(); // Déclenche la détection de changements

    // Vérifier si le bouton "Create" est affiché
    const createButton = fixture.debugElement.query(By.css('button[routerLink="create"]'));

    expect(createButton).toBeTruthy(); // Le bouton doit exister
  });

  it('should display the "Edit" button for each session if the user is an admin', () => {
    fixture.detectChanges(); // Déclenche la détection de changements

    setTimeout(() => {

      // Vérifier si le bouton "Edit" est affiché
      const editButtons = fixture.debugElement.queryAll(By.css('button[routerLink^="update"]'));

      expect(editButtons.length).toBe(mockSessions.length); // Il doit y avoir autant de boutons "Edit" que de sessions
    }, 500); // Petit délai pour laisser Angular mettre à jour le DOM
  });

  it('should have sessions data', async () => {
    fixture.detectChanges();
    await fixture.whenStable(); // Attendre que tout soit bien chargé

    component.sessions$.subscribe(sessions => {
      expect(sessions.length).toBe(mockSessions.length); // Vérifier que les sessions sont bien chargées
    });
  });


  it('should display the list of sessions', (done) => {
    fixture.detectChanges(); // Déclencher la détection initiale des changements

    // Attendre un court instant pour que les données soient mises à jour
    setTimeout(() => {
      fixture.detectChanges(); // Mettre à jour le DOM après l'attente

      let sessionsData: Session[] | undefined;

      component.sessions$.subscribe(sessions => {
        console.log('💫 Sessions récupérées par le composant:', sessions);
        sessionsData = sessions;
      });

      setTimeout(() => {
        fixture.detectChanges(); // Deuxième mise à jour après réception des données

        // Vérifier que les sessions existent
        expect(sessionsData).toBeDefined();
        expect(sessionsData!.length).toBe(mockSessions.length);

        // Vérifier si les boutons "Edit" sont bien affichés
        const editButtons = fixture.debugElement.queryAll(By.css('button[routerLink^="update"]'));
        expect(editButtons.length).toBe(mockSessions.length);

        done(); // Indiquer que le test est terminé
      }, 500); // Un léger délai pour laisser le DOM se stabiliser

    }, 300); // Un premier délai pour s'assurer que les données sont reçues
  });

});
