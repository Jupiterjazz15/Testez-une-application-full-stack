/// <reference types="cypress" />

describe('Register Form', () => {
  beforeEach(() => {
    cy.visit('/register'); // Modifier l'URL selon votre application
  });

  it('should validate email format', () => {
    cy.get('[data-cy="email"]').type('invalid-email');
    cy.get('[data-cy="email"]').should('have.class', 'ng-invalid');
  });

  it('should validate first name length', () => {
    cy.get('[data-cy="first-name"]').type('Jo'); // 2 caractères (trop court)
    cy.get('[data-cy="first-name"]').should('have.class', 'ng-invalid');

    cy.get('[data-cy="first-name"]').clear().type('J'.repeat(21)); // 21 caractères (trop long)
    cy.get('[data-cy="first-name"]').should('have.class', 'ng-invalid');
  });

  it('should validate last name length', () => {
    cy.get('[data-cy="last-name"]').type('Lo'); // 2 caractères (trop court)
    cy.get('[data-cy="last-name"]').should('have.class', 'ng-invalid');

    cy.get('[data-cy="last-name"]').clear().type('L'.repeat(21)); // 21 caractères (trop long)
    cy.get('[data-cy="last-name"]').should('have.class', 'ng-invalid');
  });

  it('should validate password length', () => {
    cy.get('[data-cy="password"]').type('12'); // 2 caractères (trop court)
    cy.get('[data-cy="password"]').should('have.class', 'ng-invalid');

    cy.get('[data-cy="password"]').clear().type('P'.repeat(41)); // 41 caractères (trop long)
    cy.get('[data-cy="password"]').should('have.class', 'ng-invalid');
  });

  it('should fill the form and submit, then be redirected', () => {
    const firstName = "John";
    const lastName = "Doe";
    const email = "johndoe@example.com";
    const password = "Password123"; // Doit respecter la longueur requise

    // Intercepter la requête API pour la simuler
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 201, // Simule une réponse réussie
      body: {} // Vous pouvez ajouter un corps de réponse si nécessaire
    }).as('registerRequest');

    cy.get('[data-cy="first-name"]').type(firstName);
    cy.get('[data-cy="last-name"]').type(lastName);
    cy.get('[data-cy="email"]').type(email);
    cy.get('[data-cy="password"]').type(password);

    cy.get('[data-cy="submit-button"]').click();

    // Attendre la requête simulée
    cy.wait('@registerRequest');

    // Vérifier la redirection vers /login
    cy.url().should('eq', Cypress.config('baseUrl') + 'login');

    // Vérification que l'alerte XSS ne s'est pas affichée
    cy.on("window:alert", () => {
      throw new Error("Une alerte XSS a été déclenchée !");
    });
  });

});
