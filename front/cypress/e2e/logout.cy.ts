/// <reference types="cypress" />

describe('Logout Test', () => {
  beforeEach(() => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', { statusCode: 200 }).as('loginRequest');

    // 🔹 Connexion de l'utilisateur
    cy.get('input[formControlName=email]').type("johndoe@example.com");
    cy.get('input[formControlName=password]').type("Password123");

    // 🔹 Cliquer sur le bouton de soumission pour se connecter
    cy.get('[data-cy="submit-button"]').click();

    // 🔹 Attendre que l'utilisateur soit redirigé vers la page des sessions
    cy.url().should('eq', Cypress.config('baseUrl') + 'sessions');
  });

  it('should log out the user and redirect to /', () => {
    // 🔹 Cliquer sur Logout
    cy.get('[data-cy="nav-logout"]').click();

    // 🔹 Vérifier la redirection vers /login
    cy.url().should('include', 'login');
  });
});
