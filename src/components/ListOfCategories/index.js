import React from 'react';
import { Category } from '../Category';
import { List, Item } from './styles';
import { categories } from '../../../api/db.json';

export const ListOfCategories = () => (
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
