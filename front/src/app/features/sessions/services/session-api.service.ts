import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Session } from '../interfaces/session.interface';

@Injectable({
  providedIn: 'root'
})
export class SessionApiService {

  private pathService = 'api/session';
  private sessionsSubject = new BehaviorSubject<Session[]>([]);
  public sessions$ = this.sessionsSubject.asObservable();

  constructor(private httpClient: HttpClient) {
  }

  public all(): Observable<Session[]> {
    this.httpClient.get<Session[]>(this.pathService).subscribe(sessions => {
      this.sessionsSubject.next(sessions); // 🔹 Met à jour le BehaviorSubject avec les nouvelles sessions
    });

    return this.sessions$;
  }

  public detail(id: string): Observable<Session> {
    return this.httpClient.get<Session>(`${this.pathService}/${id}`);
  }

  public delete(id: string): Observable<any> {
    return this.httpClient.delete(`${this.pathService}/${id}`);
  }

  public create(session: Session): Observable<Session> {
    return this.httpClient.post<Session>(this.pathService, session);
  }

  public update(id: string, session: Session): Observable<Session> {
    return this.httpClient.put<Session>(`${this.pathService}/${id}`, session);
  }

  public participate(id: string, userId: string): Observable<void> {
    return this.httpClient.post<void>(`${this.pathService}/${id}/participate/${userId}`, null);
  }

  public unParticipate(id: string, userId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.pathService}/${id}/participate/${userId}`);
  }

}
