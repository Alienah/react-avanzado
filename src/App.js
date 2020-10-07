import React from 'react';
import { GlobalStyle } from './styles/GlobalStyles';
import { ListOfCategories } from './components/ListOfCategories';
import { ListOfPhotoCards } from './containers/ListOfPhotoCards';
import { PhotoCardWithQuery } from './containers/PhotoCardWithQuery';
import { Logo } from './components/Logo';

const App = () => {
  // URLSearchParams recibe un parámetro, que va a ser la query string
  const urlParams = new window.URLSearchParams(window.location.search);
  const detailId = urlParams.get('detail');

  return (
    <div>
      <GlobalStyle />
      <Logo />
      {
        detailId
          ? <PhotoCardWithQuery id={detailId} />
          : (
            <>
              <ListOfCategories />
              <ListOfPhotoCards categoryId={2} />
            </>
          )
      }
    </div>
  );
};

export default App;
