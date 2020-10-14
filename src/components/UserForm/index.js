import React from 'react';
import PropTypes from 'prop-types';
import { useInputValue } from '../../hooks/useInputValue';
import { SubmitButton } from '../SubmitButton';
import {
  Form, Input, Title, Error,
} from './styles';

export const UserForm = ({
  disabled, errorMsg, onSubmit, title,
}) => {
  const email = useInputValue('');
  const password = useInputValue('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      email: email.value,
      password: password.value,
    });
  };

  return (
    <>
      <Title>{title}</Title>
      <Form disabled={disabled} onSubmit={handleSubmit}>
        <Input disabled={disabled} placeholder="Email" {...email} />
        <Input disabled={disabled} placeholder="Password" type="password" {...password} />
        <SubmitButton disabled={disabled}>{title}</SubmitButton>
      </Form>
      {errorMsg && <Error>{errorMsg}</Error>}
    </>
  );
};

UserForm.propTypes = {
  disabled: PropTypes.bool,
  errorMsg: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

UserForm.defaultProps = {
  disabled: false,
  errorMsg: '',
};
