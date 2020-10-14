import React from 'react';
import { PhotoCard } from '../containers/PhotoCard';
import { Layout } from '../components/Layout';

export default ({ detailId }) => (
  <Layout title={`Fotografía ${detailId}`}>
    <PhotoCard id={detailId} />
  </Layout>
);
