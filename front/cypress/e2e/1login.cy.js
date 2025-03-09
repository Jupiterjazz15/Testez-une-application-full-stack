describe('Login Form', () => {
  beforeEach(() => {
    cy.visit('/login'); // Modifier l'URL selon votre application
  });

  it('should validate email format', () => {
    cy.get('[data-cy="email"]').type('invalid-email');
    cy.get('[data-cy="email"]').should('have.class', 'ng-invalid');
  });

  it('should validate password length', () => {
    cy.get('[data-cy="password"]').type('12'); // 2 caractères (trop court)
    cy.get('[data-cy="password"]').should('have.class', 'ng-invalid');
  });

  it('should fill the form and submit, then be redirected', () => {
    cy.intercept('POST', '/api/auth/login', { statusCode: 200 }).as('loginRequest');

    const email = "johndoe@example.com";
    const password = "Password123"; // Doit respecter la longueur requise

    cy.get('[data-cy="email"]').type(email);
    cy.get('[data-cy="password"]').type(password);

    cy.get('[data-cy="submit-button"]').click();

    cy.wait('@loginRequest');

    cy.url().should('eq', Cypress.config('baseUrl') + '/sessions');
  });
});
