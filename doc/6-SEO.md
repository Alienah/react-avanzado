# REACT AVANZADO

# SEO con React Helmet

## Qué es

react helmet es un componente de React con el que puedes manejar los cambios en el head del documento, de manera que podamos gestionar mejor el SEO.

## Instalación

```bash
npm install react-helmet
```

## Uso

Lo vamos a usar, como hemos dicho para cambiar los title de las páginas, ya que ahora mismo en nuestra aplicación Petgram, siempre aparece el m,ismo title _Petgram_.

Vamos a ver un ejemplo.

Se puede usar en cualquier sitio del árbol de elementos, no hace falta que esté en una página.

```js
// src/pages/Home.js

import React from 'react';
import { Helmet } from 'react-helmet';
import { ListOfCategories } from '../components/ListOfCategories';
import { ListOfPhotoCards } from '../containers/ListOfPhotoCards';

export const Home = ({ categoryId }) => (
  <>
    <Helmet>
      <title>Petgram - Tu app de fotos de mascotas</title>
      <meta name="description" content="Con Petgram puedes encontrar fotos de animales domésticos muy bonitos" />
    </Helmet>
    <ListOfCategories />
    <ListOfPhotoCards categoryId={categoryId} />
  </>
);
```

## Uso en un componente

Como hemos dicho, no hace falta usar directamente Helmet en cada página, podemos usarlo en cualquier elemento. Por ejemplo, vamos a crear un componente Layout que al que se le pueda cambiar el title y el subtitle

```js
// src/components/Layout/index.js

import React from 'react';
import { Helmet } from 'react-helmet';
import { HeadingH1 } from '../HeadingH1';

export const Layout = ({ children, title, subtitle }) => (
  <>
    <Helmet>
      {title && <title>{title} | Petgram 🐶</title>}
      {subtitle && <meta name="description" content={subtitle} />}

    </Helmet>
    <div>
      {title && <HeadingH1>{title}</HeadingH1>}
      {subtitle && <h2>{subtitle}</h2>}
      {children}
    </div>
  </>
);
```

Y lo usaríamos por ejemplo así:

```js
// src/pages/Detail.js

import React from 'react';
import { PhotoCard } from '../containers/PhotoCard';
import { Layout } from '../components/Layout';

export const Detail = ({ detailId }) => (
  <Layout title={`Fotografía ${detailId}`}>
    <PhotoCard id={detailId} />
  </Layout>
);

```

O en favs.js

```js
// src/pages/Favs.js

import React from 'react';
import { Layout } from '../components/Layout';
import { ListOfFavs } from '../containers/ListOfFavs';

export const Favs = () => (
  <Layout title="Tus favoritos" subtitle="Aquí puedes encontrar tus favoritos">
    <ListOfFavs />
  </Layout>
);
```
