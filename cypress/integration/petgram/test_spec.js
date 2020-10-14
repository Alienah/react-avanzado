/* global describe, it, cy */

describe('Petgram', () => {
  it('renders petgram app', () => {
    cy.visit('/');
  });

  it('navigates to a category with photos', () => {
    cy.visit('/pet/1');
    cy.get('article');
  });

  it('can navigate through the navbar to home', () => {
    cy.visit('/pet/1');
    cy.get('nav a').first().click();
    cy.url().should('include', '/');
  });

  it('navigate to login page when not registered user goes to fav page', () => {
    cy.visit('/favs');
    cy.get('form').should('have.length', 2);
  });
});
