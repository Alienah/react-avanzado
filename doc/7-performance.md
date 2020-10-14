# REACT AVANZADO

# Performance

Ya sabemos que es importante cuidar la performance de nuestra aplicación para que la experiencia de usuario sea lo más satisfactoria posible. Para conseguirlo podemos tomar medidas.

## Primer paso

Lo primero que vamos a hacer en nuestra aplicación ejemplo es compilar en modo desarrollo

```bash
./node_modules/.bin/webpack --mode "development"
```

Y para poder servirlo:

```npx serve dist -s```

(Le estamos diciendo la ruta que queremos que nos sirva, dist, y que es una single page application, -s, con lo que queremos que siempre cargue el index, da igualla ruta)

También podemos añadir un script que haga las dos cosas:

```json
// package.json

"serve:dev": "webpack --mode 'development' && npx serve dist -s",
```

Una vez servido, podemos inspeccionarlo con las herramientas dev tools o react tools para medir la performance.

## Memo de React

Una de las medidas que podemos tomar es usar el memo de React. Cuando un componente está envuelto en React.memo, react memoiza el resultado del renderizado, de manera que evita renderizados innecesarios. Antes del siguiente renderizado, si detecta que las nuevas props son las mismas, reúsa el componente memoizado y así evita volver a renderizar.

Por ejemplo, imaginemos que en nuetra performnace vemos que el componente ListOfCategories se renderiza cada vez que hago clik a una categoría. En realidad el componente no cambia y no se debería volver a renderizar, así que podemos usar memo así:

```js
// src/components/ListOfCategories/index.js

// ...

const ListOfCategoriesComponent = () => {
// ...

export const ListOfCategories = React.memo(ListOfCategoriesComponent);
```

Otro ejemplo sería pasándole como segundo parámetro una función que recibe las props antiguas y las nuevas y las podemos comprar. Si son las mismas, usará el memo.

```js
// src/pages/Home.js

import React from 'react';
import { Helmet } from 'react-helmet';
import { ListOfCategories } from '../components/ListOfCategories';
import { ListOfPhotoCards } from '../containers/ListOfPhotoCards';

const HomePage = ({ categoryId }) => (
  <>
    <Helmet>
      <title>Petgram - Tu app de fotos de mascotas</title>
      <meta name="description" content="Con Petgram puedes encontrar fotos de animales domésticos muy bonitos" />
    </Helmet>
    <ListOfCategories />
    <ListOfPhotoCards categoryId={categoryId} />
  </>
);

export const Home = React.memo(
  HomePage,
  (prevProps, props) => prevProps.categoryId === props.categoryId,
);

```
