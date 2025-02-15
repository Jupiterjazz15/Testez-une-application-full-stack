import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [SessionService],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule]
    })
      .compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a mat-card-title with text "Login"', () => {

    const loginCardTitle: DebugElement = fixture.debugElement.query(By.css('.mat-card-title')); // Récupérer l'élément contenant la classe mat-card-title
    expect(loginCardTitle).toBeTruthy(); // Vérifier que l'élément est trouvé
    expect(loginCardTitle.nativeElement.textContent.trim()).toBe('Login'); // Vérifier que le texte est bien "Login"

  });

  it('should contain an email input field', () => {
    const emailInput: DebugElement = fixture.debugElement.query(By.css('input[formControlName="email"]'));
    expect(emailInput).toBeTruthy();
  });

  it('should contain a password input field', () => {
    const passwordInput: DebugElement = fixture.debugElement.query(By.css('input[formControlName="password"]'));
    expect(passwordInput).toBeTruthy();
  });

  it('should set aria-invalid="false" when the password is not empty', () => {
    const passwordInput: DebugElement = fixture.debugElement.query(By.css('input[formControlName="password"]')); // Récupérer l'élément de l'input
    expect(passwordInput).toBeTruthy(); // Vérifier que l'élément a été trouvé

    component.form.controls['password'].setValue(''); // S'assurer que le champ est vide
    fixture.detectChanges();

    expect(passwordInput.nativeElement.getAttribute('aria-invalid')).toBeNull();
  });

  it('should have the class ng-invalid password is empty', () => {
    const passwordInput: DebugElement = fixture.debugElement.query(By.css('input[formControlName="password"]')); // Récupérer l'élément de l'input
    expect(passwordInput).toBeTruthy(); // Vérifier que l'élément a été trouvé

    component.form.controls['password'].setValue(''); // S'assurer que le champ est vide
    fixture.detectChanges(); // Déclencher la mise à jour du DOM

    expect(passwordInput.nativeElement.classList).toContain('ng-invalid'); // Vérifier que la classe "ng-invalid" est bien ajoutée
  });

  it('should contain a button with text "Submit"', () => {
    const submitButton: DebugElement = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitButton).toBeTruthy();
    expect(submitButton.nativeElement.textContent.trim()).toBe('Submit');
  });

  it('should enable the submit button when all fields are filled', () => {
    const submitButton: DebugElement = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitButton).toBeTruthy();

    // Vérifier que le bouton est désactivé au départ
    expect(submitButton.nativeElement.disabled).toBeTruthy();

    // Remplir tous les champs du formulaire
    component.form.controls['email'].setValue('test@email.com');
    component.form.controls['password'].setValue('StrongPassword123');

    fixture.detectChanges(); // Mettre à jour le DOM après modification du formulaire

    // Vérifier que le bouton est maintenant activé
    expect(submitButton.nativeElement.disabled).toBeFalsy();
  });

})
