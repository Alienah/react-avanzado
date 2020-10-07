import React from 'react';
import { PhotoCard } from '../PhotoCard';

export const ListOfPhotoCardsComponent = ({ data: { photos = [] } }) => (
  <ul>
    {photos.map((photo) => (
      <li key={photo.id}>
        <PhotoCard {...photo} />
      </li>
    ))}
  </ul>
);
