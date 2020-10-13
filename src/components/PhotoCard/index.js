import React from 'react';
import { Link } from '@reach/router';
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
