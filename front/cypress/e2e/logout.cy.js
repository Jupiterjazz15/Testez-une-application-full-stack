describe('Logout Test', () => {
  beforeEach(() => {
    cy.visit('/login');

    // 🔹 Connexion de l'utilisateur
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');

    // 🔹 Vérification de la redirection vers /sessions
    cy.url().should('include', '/sessions');
    cy.wait(500);
  });

  it('should log out the user and redirect to /login', () => {
    // 🔹 Cliquer sur Logout
    cy.get('[data-cy="nav-logout"]').click();

    // 🔹 Vérifier la redirection vers /login
    cy.url().should('include', '/login');
  });
});
