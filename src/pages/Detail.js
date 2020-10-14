import React from 'react';
import PropTypes from 'prop-types';
import { PhotoCard } from '../containers/PhotoCard';
import { Layout } from '../components/Layout';

const Detail = ({ detailId }) => (
  <Layout title={`Fotografía ${detailId}`}>
    <PhotoCard id={detailId} />
  </Layout>
);

Detail.propTypes = {
  detailId: PropTypes.string.isRequired,
};

export default Detail;
