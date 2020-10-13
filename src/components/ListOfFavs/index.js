import React from 'react';
import { Grid, Image, Link } from './styles';

// TODO: Add name in db for using it as alt in img

export const ListOfFavsComponent = ({ favs = [] }) => (
  <Grid>
    {
        favs.map((fav) => (
          <Link key={fav.id} to={`/detail/${fav.id}`}>
            <Image alt="" src={fav.src} />
          </Link>
        ))
      }
  </Grid>
);
