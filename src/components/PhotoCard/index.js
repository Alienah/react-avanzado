import React from 'react';
import { MdFavoriteBorder } from 'react-icons/md';
import { ImgWrapper, Img, Button } from './styles';

const DEFAULT_IMAGE = 'https://res.cloudinary.com/midudev/image/upload/w_150/v1555671700/category_dogs.jpg';

export const PhotoCard = ({ id, likes = 0, src = DEFAULT_IMAGE }) => (
  <article>
    <a href={`/detail/${id}`}>
      <ImgWrapper>
        <Img src={src} alt="" />
      </ImgWrapper>
    </a>
    <Button type="button">
      <MdFavoriteBorder size="32px" />{likes} likes!
    </Button>
  </article>
);
