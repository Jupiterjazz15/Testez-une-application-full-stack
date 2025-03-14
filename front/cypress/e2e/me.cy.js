describe('Session informations e2e', () => {
  beforeEach(() => {
    cy.request({
      method: 'POST',
      url: '/api/auth/register',
      body: {
        email: 'metest@test.com',
        password: 'azerty',
        firstName: 'firstNameTest',
        lastName: 'lastNameTest',
      }
    }).then((response) => {
      cy.log('Inscription réussie :', response.body);
      expect(response.status).to.eq(200);
    });

    cy.visit('/login');

    // 🔹 Vérifiez que l'authentification fonctionne
    cy.request({
      method: 'POST',
      url: '/api/auth/login',
      body: {
        email: 'metest@test.com',
        password: 'azerty',
      },
      failOnStatusCode: false,
    }).then((response) => {
      cy.log('Réponse login :', response.body);
      expect(response.status).to.eq(200);
    });

    cy.visit('/login');

    // 🔹 Remplissage du formulaire de connexion
    cy.get('input[formControlName=email]').type('metest@test.com');
    cy.get('input[formControlName=password]').type('azerty{enter}{enter}');

    // 🔹 Vérification de la redirection vers /sessions
    cy.url().should('include', '/sessions');
    cy.wait(500);

    // 🔹 Cliquer sur "Account" dans la navbar
    cy.get('[data-cy="nav-account"]').click();
  });

  describe('When the user logs in with a non admin account', () => {
    it('should display Delete button and should delete the user and redirect to register', () => {
      cy.get('[data-cy="user-content"]').should('exist')
        .find('[data-cy="delete-button"]')
        .should('be.visible');
      cy.get('[data-cy="delete-button"]').click();
      // 🔹 Vérifier la redirection vers /register
      cy.url().should('include', '/register');
    });
  });

  // 🔹 NOUVEAU TEST : ADMIN NE VOIT PAS LE BOUTON DELETE
  describe('When the user logs in with an admin account', () => {
    beforeEach(() => {
      cy.visit('/login');

      // 🔹 Connexion avec un compte admin
      cy.get('input[formControlName=email]').type('yoga@studio.com');
      cy.get('input[formControlName=password]').type(
        `${'test!1234'}{enter}{enter}`
      );

      // 🔹 Vérification de la redirection vers /sessions
      cy.url().should('include', '/sessions');
      cy.wait(500);

      // 🔹 Cliquer sur "Account" dans la navbar
      cy.get('[data-cy="nav-account"]').click();
    });

    it('should not display Delete button', () => {
      // 🔹 Vérifier que le bouton Delete n'existe pas
      cy.get('[data-cy="user-content"]').should('exist')
        .find('[data-cy="delete-button"]')
        .should('not.exist');
    });
  });
});
