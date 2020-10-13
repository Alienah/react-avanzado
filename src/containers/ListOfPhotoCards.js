import React from 'react';
import { useGetPhotosQuery } from '../hooks/useGetPhotosQuery';
import { ListOfPhotoCardsComponent } from '../components/ListOfPhotoCards';

export const ListOfPhotoCards = ({ categoryId }) => {
  const { loading, error, data } = useGetPhotosQuery(categoryId);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  const { photos } = data;
  return (
    <ListOfPhotoCardsComponent photos={photos} />
  );
};
