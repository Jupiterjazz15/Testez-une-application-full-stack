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
    // Récupérer l'élément contenant la classe mat-card-title
    const debugElement: DebugElement = fixture.debugElement.query(By.css('.mat-card-title'));
    // Vérifier que l'élément est trouvé
    expect(debugElement).toBeTruthy();
    // Vérifier que le texte est bien "Register"
    expect(debugElement.nativeElement.textContent.trim()).toBe('Register');
  });

  // Ne puis-je pas

});
