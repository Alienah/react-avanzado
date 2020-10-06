import React, { useState, useEffect } from 'react';
import { Category } from '../Category';
import { List, Item } from './styles';

export const ListOfCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('https://wowgram-api.vercel.app/categories')
      .then((response) => response.json())
      .then((categoriesData) => setCategories(categoriesData));
  }, []);

  return (
    <List>
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
};
