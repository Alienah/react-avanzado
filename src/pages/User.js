import React, { useContext } from 'react';
import { Context } from '../Context';
import { HeadingH1 } from '../components/HeadingH1';
import { SubmitButton } from '../components/SubmitButton';

export const User = () => {
  const { removeAuth } = useContext(Context);
  return (
    <>
      <HeadingH1>User</HeadingH1>
      <SubmitButton onClick={removeAuth}>Cerrar Sesión</SubmitButton>
    </>
  );
};
