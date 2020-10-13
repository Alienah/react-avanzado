import React from 'react';
import { PhotoCardComponent } from '../PhotoCard';

export const ListOfPhotoCardsComponent = ({ data: { photos = [] } }) => (
  <ul>
    {photos.map((photo) => (
      <li key={photo.id}>
        <PhotoCardComponent {...photo} />
      </li>
    ))}
  </ul>
);
