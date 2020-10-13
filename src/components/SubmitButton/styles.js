import styled from 'styled-components';

export const Button = styled.button`
  display: block;
  background: #8d00ff;
  border-radius: 3px;
  color: #fff;
  height: 32px;
  width: 100%;
  text-align: center;
  &[disabled] {
    opacity: .3;
  }
`;
