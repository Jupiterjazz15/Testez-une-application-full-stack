import { HttpClientModule } from '@angular/common/http'; // Module HTTP pour les requêtes API
import { ComponentFixture, TestBed } from '@angular/core/testing'; // Outils de test Angular
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'; // Gestion des formulaires réactifs
import { MatCardModule } from '@angular/material/card'; // Module Angular Material pour les cartes
import { MatFormFieldModule } from '@angular/material/form-field'; // Champs de formulaire Material
import { MatIconModule } from '@angular/material/icon'; // Icônes Material
import { MatInputModule } from '@angular/material/input'; // Champs de saisie Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Gestion des animations Material
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { fakeAsync, flush } from '@angular/core/testing'; // pour forcer Jest à attendre les MAJ du DOM
import { expect } from '@jest/globals'; // Fonction d'assertion pour Jest


import { RegisterComponent } from './register.component'; // Import du composant à tester

describe('RegisterComponent', () => {
  let component: RegisterComponent; // Variable pour stocker l'instance du composant
  let fixture: ComponentFixture<RegisterComponent>; // Fixture pour interagir avec le composant

  // Avant chaque test, on configure l'environnement de test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent], // Déclaration du composant à tester
      imports: [
        BrowserAnimationsModule, // Nécessaire pour les animations dans les composants Material
        HttpClientModule, // Permet d'utiliser HttpClient dans le test
        ReactiveFormsModule, // Activation des formulaires réactifs
        MatCardModule, // Ajout du module Material pour l'affichage des cartes
        MatFormFieldModule, // Ajout du module Material pour les champs de formulaire
        MatIconModule, // Ajout du module Material pour les icônes
        MatInputModule // Ajout du module Material pour les champs de saisie
      ]
    })
      .compileComponents(); // Compilation des composants Angular avant exécution du test

    // Création d'une instance du composant pour le test
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance; // Récupération de l'instance du composant ?? qu'est ce que componentInstance ?
    fixture.detectChanges(); // Déclenchement de la détection des changements pour rendre le template
  });

  // Test de base : Vérifier que le composant est bien créé
  it('should create', () => {
    expect(component).toBeTruthy(); // Vérifie que l'instance du composant est bien instanciée
  });

  it('should have a mat-card-title with text "Register"', () => {

    const registerCardTitle: DebugElement = fixture.debugElement.query(By.css('.mat-card-title')); // Récupérer l'élément contenant la classe mat-card-title
    expect(registerCardTitle).toBeTruthy(); // Vérifier que l'élément est trouvé
    expect(registerCardTitle.nativeElement.textContent.trim()).toBe('Register'); // Vérifier que le texte est bien "Register"

  });

  it('should add "ng-invalid" class when last name is empty', () => {
    const lastNameInput: DebugElement = fixture.debugElement.query(By.css('input[formControlName="lastName"]'));  // Récupérer l'élément de l'input "Last name"
    expect(lastNameInput).toBeTruthy(); // Vérifier que l'élément a été trouvé
    component.form.controls['lastName'].setValue(''); // S'assurer que le champ est vide
    fixture.detectChanges();
    expect(lastNameInput.nativeElement.classList).toContain('ng-invalid'); // Vérifier que la classe "ng-invalid" est bien ajoutée au champ

  });

  it('should set aria-invalid to "true" if email is invalid', fakeAsync(() => {
    const emailInput: DebugElement = fixture.debugElement.query(By.css('input[formControlName="email"]')); // Récupérer l'élément de l'input "email"
    expect(emailInput).toBeTruthy();

    component.form.controls['email'].setValue('testemail.com'); // Définir une valeur incorrecte (sans '@')
    component.form.controls['email'].markAsTouched(); // Marquer le champ comme touché
    fixture.detectChanges();
    flush(); // Attendre toutes les mises à jour Angular

    expect(component.form.controls['email'].invalid).toBeTruthy(); // Vérifier que le champ est invalide
    expect(emailInput.nativeElement.getAttribute('aria-invalid')).toBe('true'); // Vérifier que l'attribut aria-invalid est bien "true"
  }));

  it('should set aria-invalid to "false" if email is valid', fakeAsync(() => {
    const emailInput: DebugElement = fixture.debugElement.query(By.css('input[formControlName="email"]')); // Récupérer l'élément de l'input "email"
    expect(emailInput).toBeTruthy();

    component.form.controls['email'].setValue('test@email.com'); // Définir une valeur correcte (avec '@')
    component.form.controls['email'].markAsTouched(); // Marquer le champ comme touché
    fixture.detectChanges();
    flush(); // Attendre toutes les mises à jour Angular

    expect(component.form.controls['email'].valid).toBeTruthy(); // Vérifier que le champ est valide
    expect(emailInput.nativeElement.getAttribute('aria-invalid')).toBe('false'); // Vérifier que l'attribut aria-invalid est bien "false"
  }));

});
