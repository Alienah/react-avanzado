# REACT AVANZADO

# Types con prop-types

Para este ejemplo usaremos prop-types, pero podríamos usar otras librerías como Typescript.

## Instalación

Hasta hace poco prop-types formaba parte del core de React.

Para instalarlo ejecutaremos:

```bash
npm install prop-types
```

## Uso

### Ejemplo de una prop tipo array

```js
// src/components/ListOfFavs/index.js

import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Image, Link } from './styles';

// TODO: Add name in db for using it as alt in img

export const ListOfFavsComponent = ({ favs = [] }) => (
  <Grid>
    {
        favs.map((fav) => (
          <Link key={fav.id} to={`/detail/${fav.id}`}>
            <Image alt="" src={fav.src} />
          </Link>
        ))
      }
  </Grid>
);

// Le decimos que es de tipo array,
// pero que va a tener forma de (shape) objetos, con las propiedades x, y, etc
ListOfFavsComponent.propTypes = {
  favs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      src: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
```

### Ejemplo de una prop tipo children (node)

```js
// src/components/SubmitButton/index.js

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from './styles';

export const SubmitButton = ({ children, disabled, onClick }) => (
  <Button
    disabled={disabled}
    onClick={onClick}
    type="submit"
  >
    {children}
  </Button>
);

SubmitButton.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

SubmitButton.defaultProps = {
  disabled: false,
  onClick: null,
};
```

### Ejemplo de custom prop type

```js
// src/components/PhotoCard/index.js

import React from 'react';
import { Link } from '@reach/router';
import PropTypes from 'prop-types';
import { useNearScreen } from '../../hooks/useNearScreen';
import { useToggleLikeMutation } from '../../hooks/useToggleLikeMutation';
import { FavButton } from '../FavButton';
import {
  Article, ImgWrapper, Img,
} from './styles';

// TODO: Add name in db for using it as alt in img

const DEFAULT_IMAGE = 'https://res.cloudinary.com/midudev/image/upload/w_150/v1555671700/category_dogs.jpg';

export const PhotoCardComponent = ({
  id, liked, likes = 0, src = DEFAULT_IMAGE,
}) => {
  const [show, element] = useNearScreen();
  const { toggleLike } = useToggleLikeMutation(id);

  const handleFavClick = () => {
    toggleLike();
  };

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
};

// Ejemplo de custom prop
PhotoCardComponent.propTypes = {
  id: PropTypes.string.isRequired,
  liked: PropTypes.bool.isRequired,
  src: PropTypes.string.isRequired,
  likes: (props, propName, componentName) => {
    /* eslint-disable-next-line react/destructuring-assignment */
    const propValue = props[propName];
    if (propValue === undefined) {
      return new Error(`${propValue} value must be defined`);
    }
    if (propValue < 0) {
      return new Error(`${propValue} value must be greater than 0`);
    }
    return null;
  },
};

PhotoCardComponent.defaultProps = {
  likes: 0,
};
```
