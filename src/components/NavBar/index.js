import React from 'react';
import { MdHome, MdFavoriteBorder, MdPersonOutline } from 'react-icons/md';
import { Nav, Link } from './styles';

const SIZE = '32px';

export const NavBar = () => (
  <Nav>
    <Link to="/" aria-label="Go to home"><MdHome size={SIZE} /></Link>
    <Link to="/favs" aria-label="Go to favorites"><MdFavoriteBorder size={SIZE} /></Link>
    <Link to="/user" aria-label="Go to user page"><MdPersonOutline size={SIZE} /></Link>
  </Nav>
);
