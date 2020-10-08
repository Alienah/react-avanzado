import React from 'react';
// Nos va a permitir cambiar de ruta
// Está disponible en toda la aplicación y no nos tenemos que preocupar por englobar la App, etc
import { Router } from '@reach/router';
import { GlobalStyle } from './styles/GlobalStyles';
import { PhotoCardWithQuery } from './containers/PhotoCardWithQuery';
import { Home } from './pages/Home';
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
            <Router>

              <Home path="/" />
              <Home path="/pet/:categoryId" />
            </Router>
          )
      }
    </div>
  );
};

export default App;
