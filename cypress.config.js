const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:4200", // Mets ici l'URL de ton app
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

