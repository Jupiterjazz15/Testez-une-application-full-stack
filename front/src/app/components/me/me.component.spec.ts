import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
// UTILITAIRES DE TESTS ANGULAR :
// - ComponentFixture : pour interagir avec le DOM du composant testé.
// - TestBed : pour configurer l'environnement de test.
// - fakeAsync : pour simuler des comportements asynchrones.
// - tick : pour avancer dans le temps virtuellement.
// - flush : pour vider les tâches asynchrones en attente.

import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // MODULE pour désactiver les animations
import { HttpClientModule } from '@angular/common/http';  // MODULE pour effectuer des requêtes HTTP

import { MatCardModule } from '@angular/material/card';  // MODULE Angular Material pour utiliser les cartes Material
import { MatFormFieldModule } from '@angular/material/form-field';  // MODULE Angular Material  pour les champs de formulaire Material
import { MatIconModule } from '@angular/material/icon';  // MODULE  Angular Material  pour utiliser les icônes Material
import { MatInputModule } from '@angular/material/input';  // MODULE  Angular Material  pour utiliser les champs de saisie Material
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';  // MODULE  Angular Material  pour afficher des notifications

import { MeComponent } from './me.component';  // COMPOSANT MeComponent à tester
import { SessionService } from 'src/app/services/session.service';  // SERVICE pour gérer la session de l'utilisateur
import { UserService } from 'src/app/services/user.service';  // SERVICE pour gérer les utilisateurs

import { Router } from '@angular/router';  // Import du service Router pour simuler la navigation
import { By } from '@angular/platform-browser';  // Permet de faire des sélections par CSS dans le DOM

import { of } from 'rxjs';  // Importation d'un opérateur RxJS pour retourner un Observable

import { expect } from '@jest/globals';  // Importation de Jest pour faire des assertions

describe('MeComponent', () => {  // BLOC DE TESTS

  // VARIABLES
  let component: MeComponent;  // Déclaration du composant MeComponent
  let fixture: ComponentFixture<MeComponent>;  // Fixture utilisée pour manipuler le DOM du composant
  let router: Router;  // Déclaration du service Router, utilisé pour la navigation

  // MOCK D'UN UTILISATEUR FICTIF
  const mockUser = {
    id: 1,
    firstName: 'Coralie',
    lastName: 'Haller',
    email: 'coralie.haller@example.com',
    password: 'azerty',
    admin: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // MOCK  LIE AUX SERVICES
  const mockSessionService = {
    sessionInformation: { id: 1 },  // Simulation des informations de session
    logOut: jest.fn(),  // fonction qui crée un mock de la méthode logOut de sessionService. Jest va appeler la version simuler de cette méthode
  };

  const mockUserService = {
    getById: jest.fn().mockReturnValue(of(mockUser)),  // Mock de la méthode getById fait par jest + elle retournera un observable qui émettra le mockUser (un utilisateur fictif défini dans ton test)
    delete: jest.fn().mockReturnValue(of({})),  // Mock de la méthode delete fait par jest + elle retournera un observable qui émettra un objet vide, simulant la suppression réussie de l'utilisateur
  };

  // MOCK LIE AU ROUTER
  const mockRouter = {
    navigate: jest.fn(),  // Mock de la méthode navigate pour simuler la navigation d'une page (vue) à une autre que ferait les router de notre app Anguler
  };

  // MOCK LIE A MATSNACKBAR
  const mockMatSnackBar = {
    open: jest.fn(),  // Mock de la méthode open de MatSnackBar pour afficher des notifications
  };


  beforeEach(async () => {  // Avant chaque test, configurer l'environnement de test
    await TestBed.configureTestingModule({
      declarations: [MeComponent],  // Déclare le composant à tester
      // IMPORT DES MODULES
      imports: [
        NoopAnimationsModule,  // Désactive les animations pour rendre les tests plus rapides et prévisibles
        HttpClientModule,  // Permet de faire des requêtes HTTP dans les tests
        MatSnackBarModule,  // Permet d'afficher des pop up de notifications
        MatCardModule,  // Permet d'utiliser les balises <mat-card> de Angular Material, qui est une manière élégante de structurer des informations dans des "cartes".
        MatFormFieldModule,  // Permet d'utiliser les balises <mat-form-field>, qui est une boîte de champ de formulaire avec des fonctionnalités supplémentaires (comme la mise en forme des labels, l'affichage des erreurs, etc.)
        MatIconModule,  // Permet d'utiliser les balises <mat-icon>. Ces icônes sont fournies par Angular Material et sont souvent utilisées pour ajouter des éléments visuels interactifs comme des boutons, des menus, etc.
        MatInputModule,  // Permet d'utiliser les balises <mat-input>, qui sont des champs de texte améliorés avec Angular Material.
      ],
      // INJECTION DES PROVIDERS
      providers: [
        { provide: SessionService, useValue: mockSessionService },  // Injection du mock du SessionService
        { provide: UserService, useValue: mockUserService },  // Injection du mock du UserService
        { provide: Router, useValue: mockRouter },  // Injection du mock du Router
        { provide: MatSnackBar, useValue: mockMatSnackBar },  // Injection du mock de MatSnackBar
      ],
    }).compileComponents();  // Compilation de l'environnement de test

    jest.spyOn(mockUserService, 'getById').mockReturnValue(of(mockUser));  // On espionne la méthode getById du UserService

    fixture = TestBed.createComponent(MeComponent);  // Crée à partir de notre environnement de test, un objet de type ComponentFixture, qui encapsule à la fois l'instance réelle du composant (MeComponent) et le DOM associé.

    component = fixture.componentInstance;  // La propriété `componentInstance` donne l'accès à l'instance réelle du composant `MeComponent` créée dans le cadre du test. Cela permet d'accéder à ses propriétés, de simuler des actions (comme appeler des méthodes) et d'interagir avec cet objet pour tester son comportement.

    router = TestBed.inject(Router);  // Injecte le service Router dans le test, pour pouvoir simuler ou tester la navigation dans le composant.Cela signifie qu'on récupère l'instance de la classe Router qui est déjà configurée par Angular pour être utilisée dans notre application.

    fixture.detectChanges();  // Détecte les changements dans le cycle de vie du composantde test, déclenche la détection de changements pour que les données mises à jour dans le composant soient appliquées à la vue.

  });

  // TESTS UNITAIRES

  it('should create the component', () => {  // Fonction de Jest qui définit un test unitaire. Le premier argument est une description du test, le deuxième argument est une fonction (ici fléchée/anonyme) qui contient les assertions à tester.
    expect(component).toBeDefined();  // Vérifie que l'instance du composant MeComponent (obtenue via fixture.componentInstance) est bien définie (existe et n'est pas null ou undefined)
  });

  it('should display the back arrow button', () => {
    const backButton = fixture.debugElement.query(By.css('button mat-icon'));  // On accéde à un débogueur de l'élément du DOM du composant testé et on cherche l'élément dans le DOM avec cette classe
    expect(backButton).toBeTruthy();  // Vérifie que le bouton existe, sans accéder à ses propriétés natales (donc pas besoin de .nativeElement)

    expect(backButton.nativeElement.textContent.trim()).toBe('arrow_back');  // Vérifie l'icône de "arrow_back" entre les balises contenant la classe button mat-icon est bien 'arrow_back' (donc besoin de .nativeElement + de .trim() car c'est une icône et qu'on peut avoir besoin de gérer les espaces)
  });

  it('should display "User information" in the h1', () => {
    const h1Element = fixture.debugElement.query(By.css('h1'));  // Sélectionne le h1
    expect(h1Element.nativeElement.textContent.trim()).toBe('User information');  // Vérifie que le texte correspond à "User information" (donc besoin de .nativeElement)
  });

  it('should display the user firstName correctly', () => {
    const nameElement = fixture.nativeElement.querySelector('p');  // Sélectionne le premier élément <p>
    expect(nameElement.textContent).toContain(mockUser.firstName);  // Vérifie que le prénom est bien affiché (utilisation de .toContain() car il n'y a pas besoin de gérer les espaces)
  });

  it('should display the user lastName in uppercase', () => {
    const nameElement = fixture.nativeElement.querySelector('p');  // Sélectionne le premier élément <p>
    expect(nameElement.textContent).toContain(mockUser.lastName.toUpperCase());  // Vérifie que le nom est en majuscules
  });

  it('should display the delete button if user is NOT an admin', () => {
    component.user = { ...mockUser, admin: false };  // Modifie l'utilisateur pour qu'il ne soit pas admin
    fixture.detectChanges();  // Détecte les changements dans le DOM
    const deleteButton = fixture.debugElement.query(By.css('button[color="warn"]'));  // Sélectionne btn de suppression
    expect(deleteButton).toBeTruthy();  // Vérifie que le bouton existe
  });

  it('should NOT display the delete button if user is an admin', () => {
    const deleteButton = fixture.debugElement.query(By.css('button[color="warn"]'));  // Sélectionne le bouton de suppression
    expect(deleteButton).toBeFalsy();  // Vérifie que le bouton n'existe pas
  });

  it('should display "You are admin" if the user is an admin', () => {
    const adminMessage = fixture.debugElement.query(By.css('p.my2'));  // Sélectionne le message pour l'admin
    expect(adminMessage).toBeTruthy();  // Vérifie que le message existe
    expect(adminMessage.nativeElement.textContent).toBe('You are admin');  // Vérifie que le texte est correct
  });

  it('should display the user creation date correctly', () => {
    const createdAtElement = fixture.debugElement.queryAll(By.css('p'))  // Sélectionne tous les éléments <p>
      .find(el => el.nativeElement.textContent.includes("Create at:"))?.nativeElement;  // Trouve l'élément qui contient "Create at:"
    expect(createdAtElement).toBeTruthy();  // Vérifie que l'élément existe
    expect(createdAtElement.textContent).toContain(  // Vérifie que la date de création est correctement formatée
      new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(mockUser.createdAt)
    );
  });

  it('should display the user last update date correctly', () => {
    const updatedAtElement = fixture.debugElement.queryAll(By.css('p'))
    .find(el => el.nativeElement.textContent.includes("Last update:"))?.nativeElement;
    expect(updatedAtElement.textContent).toContain(  // Vérifie que la date est correctement formatée
      new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(mockUser.updatedAt)
    );
  });

  // TESTS D'INTEGRATION //

  it('should go back when back arrow is clicked', () => {
    const historySpy = jest.spyOn(window.history, 'back'); // window.history est un objet et on crée un spy sur la fonction history.back() de cet objet
    const backButton = fixture.debugElement.query(By.css('button[mat-icon-button]'));  // Sélectionne le btn de retour

    expect(backButton).toBeTruthy();  // Vérifie que le bouton existe
    backButton.triggerEventHandler('click', null);  // Simule un clic sur le bouton de retour

    expect(historySpy).toHaveBeenCalled();  // Vérifie que la fonction history.back() a bien été appelée
  });

  describe('delete method', () => {

    it('should call userservice delete method with correct id', fakeAsync(() => {
      component.delete();  // Appelle la méthode delete du composant
      tick();  // Simule l'écoulement du temps pour les fonctions asynchrones
      flush();  // Vide les timers restants
      expect(mockUserService.delete).toHaveBeenCalledWith('1');  // Vérifie que delete a été appelé avec l'ID '1'
    }));

    it('should open matSnackBar with delete confirmation message', fakeAsync(() => {
      component.delete();  // Simule la suppression de l'utilisateur
      tick(3000);  // Attend que le snackbar se ferme après 3000 ms

      expect(mockMatSnackBar.open).toHaveBeenCalledWith(
        'Your account has been deleted !', 'Close', { duration: 3000 }  // Vérifie que la notification est affichée
      );

      flush();  // Vide toutes les tâches asynchrones restantes
    }));

    it('should call sessionService logOut method', fakeAsync(() => {
      component.delete();  // Simule la suppression
      tick();  // Simule l'écoulement du temps pour les actions asynchrones
      flush();  // Vide les timers
      expect(mockSessionService.logOut).toHaveBeenCalled();  // Vérifie que logOut a bien été appelé
    }));

    it('should navigate to homepage', fakeAsync(() => {
      component.delete();  // Simule la suppression de l'utilisateur
      tick();  // Simule l'écoulement du temps
      flush();  // Vide les timers
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);  // Vérifie que la navigation a bien eu lieu vers '/sessions'
    }));
  });

  describe('ngOnInit method', () => {
    it('should call userService.getById() with the correct ID', fakeAsync(() => {
      component.ngOnInit();  // Appelle la méthode ngOnInit du composant
      tick();  // Simule l'écoulement du temps
      flush();  // Vide les timers
      expect(mockUserService.getById).toHaveBeenCalledWith('1');  // Vérifie que getById a bien été appelé avec l'ID '1'
    }));

    it('should update the user property after fetching user data', fakeAsync(() => {
      component.ngOnInit();  // Appelle la méthode ngOnInit pour charger les données de l'utilisateur
      tick();  // Simule l'écoulement du temps
      flush();  // Vide les timers
      expect(component.user).toEqual(mockUser);  // Vérifie que l'utilisateur récupéré est bien le mockUser
    }));
  });

});
