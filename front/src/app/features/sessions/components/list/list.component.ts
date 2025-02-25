import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionInformation } from '../../../../interfaces/sessionInformation.interface';
import { SessionService } from '../../../../services/session.service';
import { Session } from '../../interfaces/session.interface';
import { SessionApiService } from '../../services/session-api.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {

  public sessions$: Observable<Session[]>;

  constructor(
    private sessionService: SessionService,
    private sessionApiService: SessionApiService
  ) {
    // Initialisation de sessions$
    this.sessions$ = this.sessionApiService.all();

    // Vérification si les sessions sont bien récupérées
    this.sessions$.subscribe(sessions => {
    });
  }

    get user(): SessionInformation | undefined {
      return this.sessionService.sessionInformation ?? undefined;
    }

    logButtonState() {
  }


}
