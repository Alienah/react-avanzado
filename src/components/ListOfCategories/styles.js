import styled from 'styled-components';
import { fadeIn } from '../../styles/animation';

export const List = styled.ul`
  display: flex;
  overflow: scroll;
  width: 100%;
  &::-webkit-scrollbar {
    display: none;
  }

  &.fixed {
    ${fadeIn({ time: '0.5s' })}
    background: #fff;
    border-radius: 60px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    /* Esta tres propiedades juntas hacen que se centre horizontalmente */
    left: 0;
    right: 0;
    margin: 0 auto;
    max-width: 400px;
    padding: 5px;
    position: fixed;
    top: -20px;
    /* Para que se vea un poc más pequeño. La mitad */
    transform: scale(.5);
    z-index: 1;
  }
`;

export const Item = styled.li`
  padding: 0 8px;
`;
