# React avanzado

# Testing

## Cypress

Con esta librería vamos a realizar los test end to end

### Instalación

```npm install cypress -D```

Ahora lo ejecutamos usando

```./node_modules/.bin/cypress open```

Lo cual va a instalar algunos recursos si no los encuentra, nos abrirá una ventana y nos creará unos archivos entre los que hay una carpeta con ejemplos

Podemos crear un script para poder ejecutar el comando de abrir cypress más cómodamente:

```json
// package.json

"test:e2e": "cypress open"
```

Podemos introducir en cypress.json una configuración que queramos que se aplique en todos los test, por ejemplo:

```json
{
  "baseUrl": "https://petgram-meet.aidaisdev.vercel.app/",
  "chromeWebSecurity": false,
  "viewportWidth": 500,
  "viewportHeight": 800
}
````

Configurar bien vercel para que la url esté correcta para los test

```
<!-- vercel.json -->

{
	"version": 2,
	"builds": [
		{
			"use": "@vercel/static-build",
			"src": "package.json"
		}
	],
	"routes": [
    {
      "src": "(.*).js",
      "dest": "/$1.js"
    },
    {
      "src": "(.*).png",
      "dest": "/$1.png"
    },
    {
      "src": "(.*).json",
      "dest": "/$1.json"
    },
    {
      "src": "/.*",
      "dest": "/index.html"
    }
  ]
}
```

Ejemplos de tests:

```js
// cypress/petgram/test_spec.js

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
```
