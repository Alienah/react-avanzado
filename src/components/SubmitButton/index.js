import React from 'react';
import PropTypes from 'prop-types';
import { Button } from './styles';

export const SubmitButton = ({ children, disabled, onClick }) => (
  <Button
    disabled={disabled}
    onClick={onClick}
    type="submit"
  >
    {children}
  </Button>
);

SubmitButton.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

SubmitButton.defaultProps = {
  disabled: false,
  onClick: null,
};
