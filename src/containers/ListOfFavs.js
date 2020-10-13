import React from 'react';
import { useGetFavsQuery } from '../hooks/useGetFavsQuery';
import { ListOfFavsComponent } from '../components/ListOfFavs';

export const ListOfFavs = () => {
  const { loading, error, data } = useGetFavsQuery();
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  const { favs } = data;
  return (
    <ListOfFavsComponent favs={favs} />
  );
};
