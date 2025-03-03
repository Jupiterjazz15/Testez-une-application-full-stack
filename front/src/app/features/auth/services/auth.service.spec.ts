import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { AuthService } from './auth.service';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

describe('AuthService', () => {
  let authService: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  // TEST UNITAIRE
  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  //  TESTS  D'INTEGRATION
  it("should send a POST request to register a new user", () => {
    const mockRegisterRequest: RegisterRequest = {
      email: "test@example.com",
      firstName: "Test",  // ✅ Ajout du prénom
      lastName: "User",   // ✅ Ajout du nom de famille
      password: "password123"
    };

    authService.register(mockRegisterRequest).subscribe();

    const req = httpTestingController.expectOne("api/auth/register");
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(mockRegisterRequest);

    req.flush(null); // Simule une réponse vide
  });

  it("should send a POST request to login and return session information", () => {
    const mockLoginRequest: LoginRequest = {
      email: "test@example.com",  // ✅ Remplace "username" par "email"
      password: "password123"
    };

    const mockSessionInfo: SessionInformation = {
      token: "mockToken",
      type: "Bearer",
      id: 1,
      username: "testUser",
      firstName: "Test",
      lastName: "User",
      admin: false
    };

    authService.login(mockLoginRequest).subscribe(sessionInfo => {
      expect(sessionInfo).toEqual(mockSessionInfo);
    });

    const req = httpTestingController.expectOne("api/auth/login");
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(mockLoginRequest);

    req.flush(mockSessionInfo);
  });

});
