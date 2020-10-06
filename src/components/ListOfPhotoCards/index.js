import React from 'react';
import { PhotoCard } from '../PhotoCard';

export const ListOfPhotoCards = () => (
  <ul>
    {[1, 2, 3, 4, 5, 6, 7].map((photoCard) => <li key={photoCard}><PhotoCard /></li>)}
  </ul>
);
