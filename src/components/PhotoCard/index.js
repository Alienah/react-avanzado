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
