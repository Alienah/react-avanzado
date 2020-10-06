import React, { useState, useEffect, Fragment } from 'react';
import { Category } from '../Category';
import { List, Item } from './styles';

export const ListOfCategories = () => {
  const [categories, setCategories] = useState([]);
  const [showFixed, setShowFixed] = useState(false);

  useEffect(() => {
    fetch('https://wowgram-api.vercel.app/categories')
      .then((response) => response.json())
      .then((categoriesData) => setCategories(categoriesData));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const newShowFixed = window.scrollY > 200;
      // Sólo vamos a querer que ocurra cuando ya no está fijo,
      // para que no cambie el estado continuamente
      if (showFixed !== newShowFixed) setShowFixed(newShowFixed);
    };

    document.addEventListener('scroll', onScroll);

    // Para eliminar las suscripciones a eventos
    return () => document.removeEventListener('scroll', onScroll);
  }, [showFixed]);

  const renderList = (fixed) => (
    <List className={fixed ? 'fixed' : ''}>
      {
      categories.map((category) => {
        const {
          cover, emoji, name, path,
        } = category;
        return (
          <Item key={category.id}>
            <Category
              cover={cover}
              emoji={emoji}
              name={name}
              path={path}
            />
          </Item>
        );
      })
    }
    </List>
  );

  return (
    <>
      {renderList()}
      {showFixed && renderList(true)}
    </>
  );
};
