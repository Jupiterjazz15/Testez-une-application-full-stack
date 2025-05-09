/// <reference types="cypress" />

describe('Login Form', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should validate email format', () => {
    cy.get('[data-cy="email"]').type('invalid-email');
    cy.get('[data-cy="email"]').should('have.class', 'ng-invalid');
  });

  it('should validate password length', () => {
    cy.get('[data-cy="password"]').type('2'); // 2 caractères (trop court)
    cy.get('[data-cy="password"]').should('have.class', 'ng-invalid');
  });

  it('should fill the form and submit, then be redirected', () => {
    // Simulation de la réponse du seveur quand la requête sera faite
    cy.intercept('POST', '/api/auth/login', { statusCode: 200 }).as('loginRequest');

    const email = "johndoe@example.com";
    const password = "Password123";

    cy.get('[data-cy="email"]').type(email);
    cy.get('[data-cy="password"]').type(password);

    cy.get('[data-cy="submit-button"]').click();

    cy.wait('@loginRequest');

    cy.url().should('eq', Cypress.config('baseUrl') + 'sessions');
  });
});
