import React from 'react';
import { Layout } from '../components/Layout';
import { ListOfFavs } from '../containers/ListOfFavs';

export const Favs = () => (
  <Layout title="Tus favoritos" subtitle="Aquí puedes encontrar tus favoritos">
    <ListOfFavs />
  </Layout>
);
