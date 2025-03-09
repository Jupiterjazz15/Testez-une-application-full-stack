
describe('Login Form', () => {
    beforeEach(() => {
        cy.visit('/login'); // On commence sur la page de login

        // ⚡ MOCKER l'API pour éviter l'erreur 401
        cy.intercept('POST', '/api/auth/login', {
            statusCode: 200, // Force une réponse réussie
            body: { token: 'fake-jwt-token' }, // Simule un token JWT
        }).as('mockLoginRequest');
    });

    it('should fill the login form and be redirected to /sessions', () => {
        const email = faker.internet.email();
        const password = faker.internet.password({ length: 12 });

        // Vérifie que l'URL est bien sur /login avant le test
        cy.location('pathname').should('eq', '/login');

        // Remplir les champs du formulaire
        cy.get('[data-cy="email"]').type(email);
        cy.get('[data-cy="password"]').type(password);
        cy.get('[data-cy="submit-button"]').click();

        // Attendre la requête API et vérifier qu'elle a été appelée
        cy.wait('@mockLoginRequest');

        // Vérifier que l'utilisateur est redirigé vers /sessions
        cy.url().should('eq', Cypress.config('baseUrl') + '/sessions');
    });
});
