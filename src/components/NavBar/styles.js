import styled from 'styled-components';
import { Link as LinkRouter } from '@reach/router';
import { fadeIn } from '../../styles/animation';

export const Link = styled(LinkRouter)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #888;
  height: 100%;
  width: 100%;
  text-decoration: none;

  &[aria-current] {
    color: #000;

    &:after {
      ${fadeIn({ time: '0.5s' })};
      content: '.';
      position: absolute;
      bottom: 0;
      font-size: 34px;
      line-height: 20px;
    }
  }
`;

export const Nav = styled.nav`
  align-items: center;
  background: #fcfcfc;
  border-top: 1px solid #e0e0e0;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  height: 50px;
  max-width: 500px;
  width: 100%;
  z-index: 10;
`;
