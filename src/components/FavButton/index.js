import React from 'react';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import PropTypes from 'prop-types';
import { Button } from './styles';

export const FavButton = ({ liked, likes, onClick }) => {
  const Icon = liked ? MdFavorite : MdFavoriteBorder;
  return (
    <Button onClick={onClick} type="button">
      <Icon size="32px" />{likes} likes!
    </Button>
  );
};

FavButton.propTypes = {
  liked: PropTypes.bool.isRequired,
  likes: PropTypes.number,
  onClick: PropTypes.func,
};

FavButton.defaultProps = {
  likes: 0,
  onClick: null,
};
