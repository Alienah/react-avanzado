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
