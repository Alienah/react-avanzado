import React from 'react';
import PropTypes from 'prop-types';
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

// Le decimos que es de tipo array,
// pero que va a tener forma de (shape) objetos, con las propiedades x, y, etc
ListOfFavsComponent.propTypes = {
  favs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      src: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
