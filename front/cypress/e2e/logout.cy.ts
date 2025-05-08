/// <reference types="cypress" />

describe('Logout Test', () => {
  beforeEach(() => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', { statusCode: 200 }).as('loginRequest');

    cy.get('input[formControlName=email]').type("johndoe@example.com");
    cy.get('input[formControlName=password]').type("Password123");

    cy.get('[data-cy="submit-button"]').click();

    cy.url().should('eq', Cypress.config('baseUrl') + 'sessions');
  });

  it('should log out the user and redirect to /', () => {
    cy.get('[data-cy="nav-logout"]').click();
    cy.url().should('include', 'login');
  });
});
