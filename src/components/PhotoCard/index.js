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
  likes: (props, propName) => {
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
