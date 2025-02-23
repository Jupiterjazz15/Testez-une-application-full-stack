import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  public isLogged = false;

  private _sessionInformation: SessionInformation | null = null;

  public get sessionInformation(): SessionInformation | null {
    return this._sessionInformation;
  }

  public set sessionInformation(value: SessionInformation | null) {
    this._sessionInformation = value;
  }

  private isLoggedSubject = new BehaviorSubject<boolean>(this.isLogged);

  public $isLogged(): Observable<boolean> {
    return this.isLoggedSubject.asObservable();
  }

  public logIn(user: SessionInformation): void {
    this.sessionInformation = user;
    this.isLogged = true;
    this.next();
  }

  public logOut(): void {
    console.log("✅ logOut() exécuté dans session.service.ts !"); // ✅ Ajout du log
    this.sessionInformation = null;
    this.isLogged = false;
    this.next();
  }

  private next(): void {
    this.isLoggedSubject.next(this.isLogged);
  }
}
