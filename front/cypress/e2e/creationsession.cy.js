describe('Session Creation E2E Test', () => {
  beforeEach(() => {
    cy.visit('/login');

    // 🔹 Connexion avec yoga@studio.com / test!1234
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');

    // 🔹 Vérification de la redirection vers /sessions
    cy.url().should('include', '/sessions');
    cy.wait(500);
  });

  it('should create a new session successfully', () => {
    // 🔹 Cliquer sur "Create" pour ajouter une session
    cy.get('[data-cy="btn-create-session"]').click();

    // 🔹 Vérifier qu'on est bien redirigé vers /sessions/create
    cy.url().should('include', '/sessions/create');

    // 🔹 Remplir le champ "Name"
    cy.get('[data-cy="session-name"]').type('Yoga pour débutants');

    // 🔹 Sélectionner une date (ex: demain)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0]; // Format YYYY-MM-DD
    cy.get('[data-cy="session-date"]').type(formattedDate);

    // 🔹 Sélectionner un professeur (ex: Margot DELAHAYE)
    cy.get('[data-cy="session-teacher"]').click();
    cy.contains('Margot DELAHAYE').click();

    // 🔹 Ajouter une description
    cy.get('[data-cy="session-description"]').type('Séance de yoga pour débutants.');

    // 🔹 Cliquer sur "Save"
    cy.get('[data-cy="btn-save-session"]').click();

    // 🔹 Vérifier la redirection vers /sessions
    cy.url().should('include', '/sessions');
  });
});
