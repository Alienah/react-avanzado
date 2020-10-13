import React from 'react';
import { Helmet } from 'react-helmet';
import { ListOfCategories } from '../components/ListOfCategories';
import { ListOfPhotoCards } from '../containers/ListOfPhotoCards';

export const Home = ({ categoryId }) => (
  <>
    <Helmet>
      <title>Petgram - Tu app de fotos de mascotas</title>
      <meta name="description" content="Con Petgram puedes encontrar fotos de animales domésticos muy bonitos" />
    </Helmet>
    <ListOfCategories />
    <ListOfPhotoCards categoryId={categoryId} />
  </>
);
