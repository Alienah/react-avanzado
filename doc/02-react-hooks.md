# REACT AVANZADO

## Hooks

Los hooks son funciones que nos permiten usar casi todas las características de React desde componentes funcionales.

Y decimos _casi todas_ porque aún están trabajando para que podamos disponer de funcionalidades como los métodos del ciclo de vida ```getSnapshotBeforeUpdate``` y ```componentDidCatch```

### Hooks principales

**useState**: para añadir un estado local ene l componente

**useEffect**: para ejecutar una función cada vez que rendericemos

**useContext**: para poder tener valores a lo que podamos acceder desde cualquier lugar de la aplicación de forma global

### Hooks auxiliares

**useReducer**

**useCallback**

**useMemo**

**useRef**

**UseImperativeHandle**

**useLayoutEffect**

**useDebugValue**: acceder a valores sin console.log

### Custom hooks

Puedes crear hooks personalizados

### Ventajas

* 100% compatibles con las clases de react. No rompen nada

* Transpilación de babel menos pesada

* mejor performance con funciones que con clases

## Aplicando los hooks useState y useEffect

Ejemplo añadiendo el fecth a nuestra api en ListOfCategories

```js
// src/components/ListOfCategories/inde.js

import React, { useState, useEffect } from 'react';
import { Category } from '../Category';
import { List, Item } from './styles';

export const ListOfCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('https://wowgram-api.vercel.app/categories')
      .then((response) => response.json())
      .then((categoriesData) => setCategories(categoriesData));
  }, []);

  return (
    <List>
      {
      categories.map((category) => {
        const {
          cover, emoji, name, path,
        } = category;
        return (
          <Item key={category.id}>
            <Category
              cover={cover}
              emoji={emoji}
              name={name}
              path={path}
            />
          </Item>
        );
      })
    }
    </List>
  );
};

```

O usando async await:

```js
// ...

useEffect(() => {
  const fetchCategories = async () => {
    const response = await fetch('https://wowgram-api.vercel.app/categories');
    const categoriesData = await response.json();
    setCategories(categoriesData);
  };
  fetchCategories();
}, []);

// ...
```

## Aplicando useEffect con suscripción a evento scroll

Queremos detectar el scroll para que se active nuestra lista fija a partir de determinada posición.

```js
// src/components/ListOfCategories/index.js

import React, { useState, useEffect, Fragment } from 'react';
import { Category } from '../Category';
import { List, Item } from './styles';

export const ListOfCategories = () => {
  const [categories, setCategories] = useState([]);
  // Hemos añadido este nuevo estado:
  const [showFixed, setShowFixed] = useState(false);

  useEffect(() => {
    fetch('https://wowgram-api.vercel.app/categories')
      .then((response) => response.json())
      .then((categoriesData) => setCategories(categoriesData));
  }, []);

  // Hemos añadido este nuevo useEffect:
  useEffect(() => {
    const onScroll = (e) => {
      const newShowFixed = window.scrollY > 200;
      // Sólo vamos a querer que ocurra cuando ya no está fijo,
      // para que no cambie el estado continuamente
      if (showFixed !== newShowFixed) setShowFixed(newShowFixed);
    };

    document.addEventListener('scroll', onScroll);

    // Para eliminar las suscripciones a eventos
    return () => document.removeEventListener('scroll', onScroll);
  });

  const renderList = (fixed) => (
    <List className={fixed ? 'fixed' : ''}>
      {
      categories.map((category) => {
        const {
          cover, emoji, name, path,
        } = category;
        return (
          <Item key={category.id}>
            <Category
              cover={cover}
              emoji={emoji}
              name={name}
              path={path}
            />
          </Item>
        );
      })
    }
    </List>
  );

  return (
    <>
      {renderList()}
      {
        // renderizamos la lista fija sólo cuando showFixed es true:
      }
      {showFixed && renderList(true)}
    </>
  );
};

```

## Creando un lazy load con useEffect e intersectionObserver

Queremos que sólo se carguen los elementos que van apareniendo en el viewport

```js
// src/componentes/PhotoCard/index.js

import React, { useEffect, useRef, useState } from 'react';
import { MdFavoriteBorder } from 'react-icons/md';
import {
  Article, ImgWrapper, Img, Button,
} from './styles';

const DEFAULT_IMAGE = 'https://res.cloudinary.com/midudev/image/upload/w_150/v1555671700/category_dogs.jpg';

export const PhotoCard = ({ id, likes = 0, src = DEFAULT_IMAGE }) => {
  const element = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Un observer que te indica si es visible un elemento, entre otras cosas
    const observer = new window.IntersectionObserver((entries) => {
      const { isIntersecting } = entries[0];
      if (isIntersecting) {
        setShow(true);
        // Porque sólo queremos que se actualice un vez
        // y una vez que está mostrándose, se puede desconectar:
        observer.disconnect();
      }
    });
    observer.observe(element.current);
  }, [element]);

  return (
    <Article ref={element}>
      {
        // Si está en el viewPort se renderiza
        show
        && (
        <>
          <a href={`/detail/${id}`}>
            <ImgWrapper>
              <Img src={src} alt="" />
            </ImgWrapper>
          </a>
          <Button type="button">
            <MdFavoriteBorder size="32px" />{likes} likes!
          </Button>
        </>
        )

      }
    </Article>
  );
};

```

Como IntersectionObserver no es compatible con IE, vamos a instalar el polyfill:

```bash
npm install intersection-observer
```

Y lo usaríamos así, haciendo un import dinámico, ya que sólo queremos que se use cuando se necesite.

```js
// src/componentes/PhotoCard/index.js

import React, { useEffect, useRef, useState } from 'react';
import { MdFavoriteBorder } from 'react-icons/md';
import {
  Article, ImgWrapper, Img, Button,
} from './styles';

const DEFAULT_IMAGE = 'https://res.cloudinary.com/midudev/image/upload/w_150/v1555671700/category_dogs.jpg';

export const PhotoCard = ({ id, likes = 0, src = DEFAULT_IMAGE }) => {
  const element = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Envolvemos la ternaria en una promes para que siempre nos devuelva el resultado de una promesa
    Promise.resolve(
      typeof window.IntersectionObserver !== 'undefined'
        ? window.IntersectionObserver
        // Este import devuelve una promesa, que se resolverá cuando la dependencia esté lista
        : import('intersection-observer')
    ).then(() => {
      // Un observer que te indica si es visible un elemento, entre otras cosas
      const observer = new window.IntersectionObserver((entries) => {
        const { isIntersecting } = entries[0];
        if (isIntersecting) {
          setShow(true);
          // Porque sólo queremos que se actualice un vez
          // y una vez que está mostrándose, se puede desconectar:
          observer.disconnect();
        }
      });
      observer.observe(element.current);
    })
  }, [element]);

  return (
    <Article ref={element}>
      {
        // Si está en el viewPort se renderiza
        show
        && (
        <>
          <a href={`/detail/${id}`}>
            <ImgWrapper>
              <Img src={src} alt="" />
            </ImgWrapper>
          </a>
          <Button type="button">
            <MdFavoriteBorder size="32px" />{likes} likes!
          </Button>
        </>
        )

      }
    </Article>
  );
};

```

Si quisiéramos que eslint soportara los métodos de javascript que son también experimentales, como en nuestro caso el import, instalaríamos este parseador:

```bash
npm install babel-eslint --save-dev
```

## Ejemeplo usando localStorage

Retomando el ejemplo anterior, hacemos que se almacene en el localStorage cuando le damos al like a una foto

```js
// src/componentes/PhotoCard/index.js

import React, { useEffect, useRef, useState } from 'react';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import {
  Article, ImgWrapper, Img, Button,
} from './styles';

const DEFAULT_IMAGE = 'https://res.cloudinary.com/midudev/image/upload/w_150/v1555671700/category_dogs.jpg';

export const PhotoCard = ({ id, likes = 0, src = DEFAULT_IMAGE }) => {
  const element = useRef(null);
  const [show, setShow] = useState(false);
  const key = `like-${id}`;
  const [liked, setLiked] = useState(() => {
    try {
      const like = window.localStorage.getItem(key);
      // Lo tenemos que parsear para que en vez de string nos devuelva el valor true o false
      return JSON.parse(like);
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.error(error);
      return false;
    }
  });

  useEffect(() => {
    // Envolvemos la ternaria en una promesa
    // para que siempre nos devuelva el resultado de una promesa
    Promise.resolve(
      typeof window.IntersectionObserver !== 'undefined'
        ? window.IntersectionObserver
        // Este import devuelve una promesa, que se resolverá cuando la dependencia esté lista
        : import('intersection-observer'),
    ).then(() => {
      // Un observer que te indica si es visible un elemento, entre otras cosas
      const observer = new window.IntersectionObserver((entries) => {
        const { isIntersecting } = entries[0];
        if (isIntersecting) {
          setShow(true);
          // Porque sólo queremos que se actualice un vez
          // y una vez que está mostrándose, se puede desconectar:
          observer.disconnect();
        }
      });
      observer.observe(element.current);
    });
  }, [element]);

  const Icon = liked ? MdFavorite : MdFavoriteBorder;

  const setLocalStorage = (value) => {
    try {
      window.localStorage.setItem(key, value);
      setLiked(value);
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.error(error);
    }
  };

  return (
    <Article ref={element}>
      {
        // Si está en el viewPort se renderiza
        show
        && (
        <>
          <a href={`/detail/${id}`}>
            <ImgWrapper>
              <Img src={src} alt="" />
            </ImgWrapper>
          </a>
          <Button onClick={() => setLocalStorage(!liked)} type="button">
            <Icon size="32px" />{likes} likes!
          </Button>
        </>
        )

      }
    </Article>
  );
};

```

## Refactorizamos para hacer custom hooks useNearScreen y useLocalStorage

Partiendo del ejemplo anterior, vamos a crear dos custom hooks:

**useLocalStorage**

```js
// src/hooks/useLocalStorage.js

import { useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item != null ? JSON.parse(item) : initialValue;
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.error(error);
      return false;
    }
  });

  const setLocalStorage = (value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      setValue(value);
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.error(error);
    }
  };

  return [storedValue, setLocalStorage];
}

```

**useNearScreen**

```js
// src/hooks/useNearScreen.js

import { useEffect, useRef, useState } from 'react';

export function useNearScreen() {
  const element = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    Promise.resolve(
      typeof window.IntersectionObserver !== 'undefined'
        ? window.IntersectionObserver
        : import('intersection-observer'),
    ).then(() => {
      const observer = new window.IntersectionObserver((entries) => {
        const { isIntersecting } = entries[0];
        if (isIntersecting) {
          setShow(true);
          observer.disconnect();
        }
      });
      observer.observe(element.current);
    });
  }, [element]);
  return [show, element];
}

```

**Resultado**

Y PhotoCard quedaría así:

```js
// src/components/PhotoCard/index.js

import React from 'react';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useNearScreen } from '../../hooks/useNearScreen';
import {
  Article, ImgWrapper, Img, Button,
} from './styles';

const DEFAULT_IMAGE = 'https://res.cloudinary.com/midudev/image/upload/w_150/v1555671700/category_dogs.jpg';

export const PhotoCard = ({ id, likes = 0, src = DEFAULT_IMAGE }) => {
  // const element = useRef(null);
  // const [show, setShow] = useState(false);
  const [show, element] = useNearScreen();
  const key = `like-${id}`;
  const [liked, setLiked] = useLocalStorage(key, false);

  const Icon = liked ? MdFavorite : MdFavoriteBorder;

  return (
    <Article ref={element}>
      {
        show
        && (
        <>
          <a href={`/detail/${id}`}>
            <ImgWrapper>
              <Img src={src} alt="" />
            </ImgWrapper>
          </a>
          <Button onClick={() => setLiked(!liked)} type="button">
            <Icon size="32px" />{likes} likes!
          </Button>
        </>
        )

      }
    </Article>
  );
};

```
