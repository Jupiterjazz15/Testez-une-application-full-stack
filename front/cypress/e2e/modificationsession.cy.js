describe('Modify a session', () => {
  it('should allow an admin to modify a session name', () => {
    // 1️⃣ Se connecter avec yoga@studio.com / test!1234
    cy.visit('/login');

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}');

    // 2️⃣ Vérifier qu'on arrive bien sur /sessions
    cy.url().should('include', '/sessions');
    cy.wait(500);

    // 3️⃣ Cliquer sur le premier bouton Edit
    cy.get('[data-cy="session-edit"]').first().click();

    // 4️⃣ Vérifier qu'on est bien sur la page d'édition /sessions/update/id
    cy.url().should('match', /\/sessions\/update\/\d+/);
    cy.wait(500);

    // 5️⃣ Modifier le champ Name
    cy.get('input[data-cy="session-name"]').clear().type('Nouveau nom');

    // 6️⃣ Cliquer sur Save
    cy.get('button[data-cy="btn-save-session"]').click();

    // 7️⃣ Vérifier qu'on est bien redirigé vers /sessions
    cy.url().should('include', '/sessions');
    cy.wait(500);

    // 8️⃣ Vérifier que le nom de la première session est bien "Nouveau nom"
    cy.get('.item').first().find('mat-card-title').should('contain', 'Nouveau nom');
  });
});
