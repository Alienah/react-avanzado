import React from 'react';
import { useNearScreen } from '../../hooks/useNearScreen';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { ToggleLikeMutation } from '../../containers/ToggleLikeMutation';
import { FavButton } from '../FavButton';
import {
  Article, ImgWrapper, Img,
} from './styles';

const DEFAULT_IMAGE = 'https://res.cloudinary.com/midudev/image/upload/w_150/v1555671700/category_dogs.jpg';

export const PhotoCard = ({ id, likes = 0, src = DEFAULT_IMAGE }) => {
  const [show, element] = useNearScreen();
  const key = `like-${id}`;
  const [liked, setLiked] = useLocalStorage(key, false);

  return (
    <Article ref={element}>
      {
        // Si está en el viewPort se renderiza
        show
        && (
        <>
          <a href={`/?detail=${id}`}>
            <ImgWrapper>
              <Img src={src} alt="" />
            </ImgWrapper>
          </a>
          <ToggleLikeMutation>
            {
              // usamos el favButton como children en la render Prop
              // Usamos renderProp porque queremos inyectar cosas
              // como parámetro a esta función le va a llegar la mutación que queremos realizar
              (toggleLike) => {
                const handleFavClick = () => {
                  if (!liked) toggleLike({ variables: { input: { id } } });
                  setLiked(!liked);
                };
                return <FavButton liked={liked} likes={likes} onClick={handleFavClick} />;
              }
            }
          </ToggleLikeMutation>

        </>
        )

      }
    </Article>
  );
};
