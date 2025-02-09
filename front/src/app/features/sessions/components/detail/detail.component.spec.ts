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

});
