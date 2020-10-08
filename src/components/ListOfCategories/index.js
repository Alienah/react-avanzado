import React, { useState, useEffect } from 'react';
import { Category } from '../Category';
import { List, Item } from './styles';

function useCategoriesData() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('https://wowgram-api.vercel.app/categories')
      .then((response) => response.json())
      .then((categoriesData) => {
        setCategories(categoriesData);
        setLoading(false);
      });
  }, []);

  return { categories, loading };
}

export const ListOfCategories = () => {
  const { categories, loading } = useCategoriesData();
  const [showFixed, setShowFixed] = useState(false);

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
    // Como estamos usando styled-components
    // en vez de className={fixed ? 'fixed' : ''}
    // usamos props
    <List fixed={fixed}>
      {
        loading
          ? <Item key="loading"><Category /></Item>
          : categories.map((category) => {
            const {
              cover, emoji, id, name, path,
            } = category;
            return (
              <Item key={id}>
                <Category
                  cover={cover}
                  emoji={emoji}
                  name={name}
                  path={`/pet/${id}`}
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
