import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user.interface';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss']
})
export class MeComponent implements OnInit {

  public user: User | undefined;

  constructor(private router: Router,
              private sessionService: SessionService,
              private matSnackBar: MatSnackBar,
              private userService: UserService) {
  }

  public ngOnInit(): void {
    this.userService
      .getById(this.sessionService.sessionInformation!.id.toString())
      .subscribe((user: User) => this.user = user);
  }

  public back(): void {
    window.history.back();
  }

  public delete(): void {
    console.log("🔹 Avant appel de logOut()"); //  Debug

    this.userService.delete(this.sessionService.sessionInformation!.id.toString()).subscribe({
      next: () => {
        console.log("🔔 Avant l'affichage du snackbar");
        this.matSnackBar.open("🌻 Your account has been deleted !", 'Close', { duration: 3000 });
        console.log("✅ Snackbar ouvert !");
        this.sessionService.logOut();
        this.router.navigate(['/']);
      },
      error: error => {
        console.error("❌ Erreur suppression:", error); //  Debug en cas d'échec
      }
    });
  }

}
