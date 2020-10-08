# REACT AVANZADO

# Reach Router

Creado por el mismo que creó React Router, en un futuro se fusionarán.

## Instalación

```npm install @reach/router```

## Uso

Una de las primeras utilidades que vamos a usar es Router, que nos servirá para especificar las rutas.

Importante destacar quie Router está disponible en cualquier parte de la aplicación sin necesidad de tener que introducir la App en un wrapper.

En App lo podríamos usar así:

```js
// src/App.js

import React from 'react';
// Nos va a permitir cambiar de ruta
// Está disponible en toda la aplicación y no nos tenemos que preocupar por englobar la App, etc
import { Router } from '@reach/router';
import { GlobalStyle } from './styles/GlobalStyles';
import { PhotoCardWithQuery } from './containers/PhotoCardWithQuery';
import { Home } from './pages/Home';
import { Logo } from './components/Logo';

const App = () => {
  // URLSearchParams recibe un parámetro, que va a ser la query string
  const urlParams = new window.URLSearchParams(window.location.search);
  const detailId = urlParams.get('detail');

  return (
    <div>
      <GlobalStyle />
      <Logo />
      {
        detailId
          ? <PhotoCardWithQuery id={detailId} />
          : (
            <Router>

              <Home path="/" />
              <Home path="/pet/:animalCategoryId" />
            </Router>
          )
      }
    </div>
  );
};

export default App;

```

Habiendo creado previamente las páginas. Esta es la Home:

```js
// src/pages/Home.js

import React from 'react';
import { ListOfCategories } from '../components/ListOfCategories';
import { ListOfPhotoCards } from '../containers/ListOfPhotoCards';

export const Home = () => (
  <>
    <ListOfCategories />
    <ListOfPhotoCards categoryId={2} />
  </>
);
```

Y para adaptar ese path del Router pet/:id, modificamos el path que le pasamos a la Category desde ListOfCategories:

```js
  // src/components/ListOfCategories/index.js

  // ...

  const renderList = (fixed) => (
    <List fixed={fixed}>
      {
        loading
          ? <Item key="loading"><Category /></Item>
          : categories.map((category) => {
            const {
              cover, emoji, id, name, path,
            } = category;
            return (
              <Item key={id}>
                <Category
                  cover={cover}
                  emoji={emoji}
                  name={name}
                  path={`/pet/${id}`}
                />
              </Item>
            );
          })
    }
    </List>
  );

  // ...

```

Sin embargo, si probamos en el navegador, aunque al hacer click en un category, viaja a la ruta correcta, pero se ve en pantalla un error 404 y no se ve nada. No hay un error en el código y no muestra nada en la consola, eso es porque webpack está intentando cargar físicamente esa url, así que tenemos que cambiar cómo inicializamos con webpack nuestro entorno de desarrollo. Añadiremos el flag ```--history-api-fallback```:

```json
// package.json

"dev": "webpack-dev-server --history-api-fallback",
```

De esta manera, cada vez que intente acceder a una ruta, el fallback que va a usar va a ser siempre el index.html, de modo que si hay un 404, va a intentar acceder al index.html. Esto es así porque nuestro enrutado está en el cliente.

Si volvemos a arrancar el entorno, ahora ya vemos un error diferente, un error de que no encuentra el archivo app.bundle.js.

Para solucionarlo, vamos a cambiar en la configuración de webpack lo siguiente:

Vamos a decirle que el path del output donde debe encontrar ese bandle sea ```/```, la raíz. De esta forma no intentará en la ruta buscar ese archivo.

```js
// webpack.config.js

  output: {
    filename: 'app.bundle.js',
    publicPath: '/',
  },
```

Ahora faltaría el último paso para que cuando haga click en una categoría se vea lo correspondiente a la id de esa categoría. Para ello, vamos a decirle a Home, que va a recibir una id, la cual va a recuperar del path (recordemos que el path contiene la variable id a la que viaja)

```js
// Home.js
// ...
export const Home = ({ animalCategoryId }) => (
  <>
    <ListOfCategories />
    <ListOfPhotoCards categoryId={animalCategoryId} />
  </>
);
```

## Uso de Link para evitar recargar página

En lugar del anchor (que hace que navegue realmente a una página), vamos a usar el Link de Reach Router

En el ejemplo de Category, vamos a cambiar uno por otro así:

```js
// src/components/Category/styles.js

import styled from 'styled-components';
// Usamos Link de reach Router
import { Link as LinkRouter } from '@reach/router';

// Lo usamos en styles, porque recordemos que con styled-component la etiqueta de html que estilamos se declara aquí
// Antes export const Anchor = styled.a`
export const Link = styled(LinkRouter)`
  display: flex;
  flex-direction: column;
  text-align: center;
  text-decoration: none;
  width: 75px;
`;

export const Image = styled.img`
  border: 1px solid #ddd;
  box-shadow: 0px 10px 14px rgba(0, 0, 0, .2);
  border-radius: 50%;
  height: auto;
  overflow: hidden;
  object-fit: cover;
  height: 75px;
  width: 75px;
`;
```

Y en el index cambiaríamos el parámetro que recibe, porque ya no estamos usando un anchor, sino un componente Link, que en vez de ```href``` usa ```to```

```js
// src/components/Category/index.js

// ...
import { Link, Image } from './styles';

// ...

// También hemos cambiado el path para que tenga un anchor por defecto, ya que de otro modo, da error
export const Category = ({ cover = DEFAULT_IMAGE, path = '#', emoji = '?' }) => (
  <Link to={path}>
    <Image src={cover} alt="imagen" />
    {emoji}
  </Link>
);
```

La ventaja de Link es que por accesibilidda, cuando navega al link especificado, se posiciona en el contenido principal de esa página automáticamente.

### Ejemplo de refactor de la página de detail.

Como tenemos la configuración del detalle hecha para que se esté fijando en la query string, aunque le hagamos click al logo de la página desde la ruta del detalle del animal, no navega a la home.

```js
  // URLSearchParams recibe un parámetro, que va a ser la query string
  const urlParams = new window.URLSearchParams(window.location.search);
  const detailId = urlParams.get('detail');
```

Vamos a cambiar eso para que detail tenga su página y esté dentro del Router

Creamos la página y ahora va a recibir el id por el path, igualq ue la home

```js
// src/pages/Detail.js

import React from 'react';
import { PhotoCardWithQuery } from '../containers/PhotoCardWithQuery';

export const Detail = ({ detailId }) => <PhotoCardWithQuery id={detailId} />;
```

Y en la App, eliminamos lo que había antes y establecemos el nuevo path de la página Detail, ahora ya dentro del Router

```js
// App.js

import React from 'react';
import { Router } from '@reach/router';
import { GlobalStyle } from './styles/GlobalStyles';
import { Home } from './pages/Home';
import { Detail } from './pages/Detail';
import { Logo } from './components/Logo';

const App = () => (
  <div>
    <GlobalStyle />
    <Logo />
    <Router>
      <Home path="/" />
      <Home path="/pet/:categoryId" />
      <Detail path="/detail/:detailId" />
    </Router>

  </div>
);

export default App;

```

Sin embargo, cuando hacemos click en una imagen, nos sigue apareciendo la ruta anterior que es una query string (con ```?detail=```) y ahora donde está en contenido es en ```detail/```,

Así que vamos a cambiar el path en PhotoCard y además vamos a importar Link para que no recargue la página cada vez que navega a una ruta, ya que es una PWA.

```js
// src/components/PhotoCard/index.js

// ...
import { Link } from '@reach/router';

// ...
  return (
    <Article ref={element}>
      {
        // Si está en el viewPort se renderiza
        show
        && (
        <>
          <Link to={`/detail/${id}`}>
            <ImgWrapper>
              <Img src={src} alt="" />
            </ImgWrapper>
          </Link>
          <FavButton liked={liked} likes={likes} onClick={handleFavClick} />

        </>
        )

      }
    </Article>
  );
// ...

```

## Creamos una barra de navegación con Link

Vamos a crear un componente NavBar

```js
// src/components/NavBar/index.js

import React from 'react';
import { MdHome, MdFavoriteBorder, MdPersonOutline } from 'react-icons/md';
import { Nav, Link } from './styles';

const SIZE = '32px';

export const NavBar = () => (
  <Nav>
    <Link to="/" aria-label="Go to home"><MdHome size={SIZE} /></Link>
    <Link to="/favs" aria-label="Go to favorites"><MdFavoriteBorder size={SIZE} /></Link>
    <Link to="/user" aria-label="Go to user page"><MdPersonOutline size={SIZE} /></Link>
  </Nav>
);
```

Y usamos Link junto con styled components para dar estilos a los enlaces. Además, nos aprovechamos de que Link le pone a sus acnhor un atributo llamado aria-current, para dar estilo al elemento del menú que está activo.

```js
// src/components/NavBar/styles.js

import styled from 'styled-components';
import { Link as LinkRouter } from '@reach/router';
import { fadeIn } from '../../styles/animation';

export const Link = styled(LinkRouter)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #888;
  height: 100%;
  width: 100%;
  text-decoration: none;

  &[aria-current] {
    color: #000;

    &:after {
      ${fadeIn({ time: '0.5s' })};
      content: '.';
      position: absolute;
      bottom: 0;
      font-size: 34px;
      line-height: 20px;
    }
  }
`;

export const Nav = styled.nav`
  align-items: center;
  background: #fcfcfc;
  border-top: 1px solid #e0e0e0;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  height: 50px;
  max-width: 500px;
  width: 100%;
  z-index: 10;
`;

```

Y lo colocamos en nuestra App

```js
// App.js

// ...
import { NavBar } from './components/NavBar';

const App = () => (
  <div>
    <GlobalStyle />
    <Logo />
    <Router>
      <Home path="/" />
      <Home path="/pet/:categoryId" />
      <Detail path="/detail/:detailId" />
    </Router>
    <NavBar />

  </div>
);

export default App;
```
