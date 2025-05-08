import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { of } from 'rxjs';
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

  const mockSessionApiService = {
    delete: jest.fn().mockReturnValue(of({})),
    detail: jest.fn().mockReturnValue(of(mockSession)),
    participate: jest.fn().mockReturnValue(of({})),
    unParticipate: jest.fn().mockReturnValue(of({})),
  };

  const mockSessionService = {
    sessionInformation: { id: 1, admin: true },
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  const mockMatSnackBar = {
    open: jest.fn(),
  };


  beforeEach(async () => {
    jest.clearAllMocks()
    jest.spyOn(mockSessionApiService, 'detail').mockReturnValue(of(mockSession));
    jest.spyOn(mockTeacherService, 'detail').mockReturnValue(of(mockTeacher));

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
        RouterTestingModule.withRoutes([]), // Assure un Router correctement défini
        BrowserAnimationsModule, // Nécessaire pour éviter les erreurs liées à MatSnackBar
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


// TESTS UNITAIRES

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
    component.isAdmin = true;
    fixture.detectChanges();

    const deleteButton = fixture.nativeElement.querySelector('button[color="warn"]');
    expect(deleteButton).toBeTruthy();
    expect(deleteButton.textContent).toContain('Delete');
  });

  it('should not display the Delete button if the user is not an admin', () => {
    component.isAdmin = false;
    fixture.detectChanges();

    const deleteButton = fixture.debugElement.query(By.css('[data-testid="delete-button"]'));
    expect(deleteButton).toBeNull();
  });

  it('should display the "Participate" button if the user is not a participant', () => {
    component.session = { ...mockSession, users: [] }; // je modifie la session mocké sans participant

    component.isParticipate = false;
    component.isAdmin = false;
    fixture.detectChanges();

    const participateButton = fixture.debugElement.query(By.css('button[mat-raised-button]'));

    expect(participateButton).toBeTruthy();
    expect(participateButton.nativeElement.textContent.trim()).toContain('Participate');
  });

  it('should display the "Do not participate" button if the user is a participant and not an admin', () => {
    component.session = { ...mockSession, users: [1] };

    component.isParticipate = true;
    component.isAdmin = false;
    fixture.detectChanges();

    const doNotParticipateButton = fixture.debugElement.query(By.css('button[mat-raised-button]'));

    expect(doNotParticipateButton).toBeTruthy();
    expect(doNotParticipateButton.nativeElement.textContent.trim()).toContain('Do not participate');
  });

  it('should display the teacher\'s name if a teacher is assigned', () => {
    component.teacher = mockTeacher;
    fixture.detectChanges();

    const teacherElement = fixture.debugElement.query(By.css('mat-card-subtitle'));

    expect(teacherElement).toBeTruthy();
    expect(teacherElement.nativeElement.textContent).toContain('Nathalie HALLER');
  });

  it('should display the number of participants if a teacher is assigned', () => {
    component.session = mockSession;
    component.teacher = mockTeacher;

    fixture.detectChanges();

    const participantsElement = fixture.debugElement.query(By.css('mat-card-content div:first-of-type span.ml1'));

    expect(participantsElement).toBeTruthy();
    expect(participantsElement.nativeElement.textContent.trim()).toBe(`${mockSession.users.length} attendees`);
  });

  it('should display the session date if a teacher is assigned', () => {
    component.session = mockSession;
    component.teacher = mockTeacher;

    fixture.detectChanges();

    const dateElement = fixture.debugElement.query(By.css('.my2 div:nth-child(2) span'));

    expect(dateElement).toBeTruthy();
    expect(dateElement.nativeElement.textContent).toContain('February 10, 2025');
  });

  it('should display the session description if a teacher is assigned', () => {
    component.session = mockSession;
    component.teacher = mockTeacher;

    fixture.detectChanges();

    const descriptionElement = fixture.debugElement.query(By.css('.description'));

    expect(descriptionElement).toBeTruthy();
    expect(descriptionElement.nativeElement.textContent).toContain(mockSession.description);
  });

  it('should display the session createdAt date if a teacher is assigned', () => {
    component.session = mockSession;
    component.teacher = mockTeacher;

    fixture.detectChanges();

    const createdAtElement = fixture.debugElement.query(By.css('.created'));

    expect(createdAtElement).toBeTruthy();
    expect(createdAtElement.nativeElement.textContent).toContain('January 1, 2025');
  });

  it('should display the session updatedAt date if a teacher is assigned', () => {
    component.session = mockSession;
    component.teacher = mockTeacher;

    fixture.detectChanges();

    const updatedAtElement = fixture.debugElement.query(By.css('.updated'));

    expect(updatedAtElement).toBeTruthy();
    expect(updatedAtElement.nativeElement.textContent).toContain('February 1, 2025');
  });


// TESTS D'INTEGRATION

  describe('ngOnInit method', () => {
    beforeEach(() => {
      jest.spyOn(mockSessionApiService, 'detail').mockReturnValue(of(mockSession));
    });

    it('should call fetchSession and retrieve session data', () => {
      component.ngOnInit();

      expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
      expect(component.session).toEqual(mockSession);
    });
  });

  it('should go back when back arrow is clicked', () => {
    const historySpy = jest.spyOn(window.history, 'back');
    const backButton = fixture.debugElement.query(By.css('[data-testid="back-button"]'));

    expect(backButton).toBeTruthy();
    backButton.triggerEventHandler('click', null);

    expect(historySpy).toHaveBeenCalled();
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
      jest.spyOn(mockSessionApiService, 'participate').mockReturnValue(of({}));
      jest.spyOn(component as any, 'fetchSession').mockImplementation();
    });

    it('should call sessionApiService.participate with the correct sessionId and userId', () => {
      component.participate();

      expect(mockSessionApiService.participate).toHaveBeenCalledWith('1', '1');
    });

    it('should call fetchSession after participate()', () => {
      component.participate();

      expect(component['fetchSession']).toHaveBeenCalled();
    });
  });

  describe('unParticipate method', () => {

    beforeEach(() => {
      jest.spyOn(mockSessionApiService, 'unParticipate').mockReturnValue(of({}));
      jest.spyOn(component as any, 'fetchSession').mockImplementation();
    });

    it('should call sessionApiService.unParticipate with correct sessionId and userId', () => {
      component.unParticipate();

      expect(mockSessionApiService.unParticipate).toHaveBeenCalledWith('1', '1');
    });

    it('should call fetchSession after unParticipate()', () => {
      component.unParticipate();

      expect(component['fetchSession']).toHaveBeenCalled();
    });
  });

  describe('fetchSession method', () => {

    beforeEach(() => {
      jest.spyOn(mockSessionApiService, 'detail').mockReturnValue(of(mockSession));
      jest.spyOn(mockTeacherService, 'detail').mockReturnValue(of(mockTeacher));
    });

    it('should call sessionApiService.detail with the correct sessionId', () => {
      (component as any).fetchSession();

      expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
    });

    it('should update session with the data returned by sessionApiService.detail', () => {
      (component as any).fetchSession();

      expect(component.session).toEqual(mockSession);
    });

    it('should update isParticipate based on session users', () => {

      (component as any).fetchSession();

      expect(component.isParticipate).toBe(true);
    });

    it('should call teacherService.detail with the correct teacher ID', waitForAsync(() => {
      // je dois utiliser waitForAsync car fakeAsync ne fonctionne pas
      (component as any).fetchSession();

      fixture.whenStable().then(() => {
        expect(mockTeacherService.detail).toHaveBeenCalledWith(mockSession.teacher_id);
      });
    }));

    it('should update teacher with the data returned by teacherService.detail', waitForAsync(() => {
      // je dois utiliser waitForAsync car fakeAsync ne fonctionne pas
      (component as any).fetchSession();

      fixture.whenStable().then(() => {
        expect(component.teacher).toEqual(mockTeacher);
      });
    }));

  });

});
