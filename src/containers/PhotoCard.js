import React from 'react';
import { useGetSinglePhotoQuery } from '../hooks/useGetSinglePhotoQuery';
import { PhotoCardComponent } from '../components/PhotoCard';

export const PhotoCard = ({ id }) => {
  const { loading, error, data } = useGetSinglePhotoQuery(id);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  const { photo } = data;
  return (
    <PhotoCardComponent {...photo} />
  );
};
