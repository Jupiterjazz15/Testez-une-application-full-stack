import { faker } from '@faker-js/faker';

describe('Register Form', () => {
    beforeEach(() => {
        cy.visit('/register'); // Modifier l'URL selon votre application
    });

    it('should fill the form and submit, then be redirected', () => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email();
        const password = faker.internet.password();

        cy.get('[data-cy="first-name"]').type(firstName);
        cy.get('[data-cy="last-name"]').type(lastName);
        cy.get('[data-cy="email"]').type(email);
        cy.get('[data-cy="password"]').type(password);

        cy.get('[data-cy="submit-button"]').click();

        cy.url().should('eq', Cypress.config('baseUrl') + '/login');

        // Vérification que l'alerte XSS ne s'est pas affichée
        cy.on("window:alert", () => {
            throw new Error("Une alerte XSS a été déclenchée !");
        });

    });
});
