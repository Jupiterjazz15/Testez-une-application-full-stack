// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// When a command from ./commands is ready to use, import with `import './commands'` syntax
// import './commands';

// Déclare la variable __coverage__ dans le type global
declare global {
  interface Window {
    __coverage__?: any;
  }
}

if (window.__coverage__) {
  console.log('✅ Code coverage is active !');
}

import '@cypress/code-coverage/support';
