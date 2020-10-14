import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { Div, Title, Subtitle } from './styles';

export const Layout = ({ children, title, subtitle }) => (
  <>
    <Helmet>
      {
      /* eslint-disable-next-line */
      title && <title>{title} | Petgram 🐶</title>
      }
      {subtitle && <meta name="description" content={subtitle} />}

    </Helmet>
    <Div>
      {title && <Title>{title}</Title>}
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
      {children}
    </Div>
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

Layout.defaultProps = {
  title: '',
  subtitle: '',
};
