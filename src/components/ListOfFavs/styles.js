import styled from 'styled-components';
import { Link as LinkRouter } from '@reach/router';

export const Link = styled(LinkRouter)`
  border-radius: 8px;
  box-shadow: 0 0 8px rgba(0, 0, 0, .3);
  display: inline-block;
  position: relative;
  margin: 1%;
  width: 31.33%;
  overflow: hidden;
  /* para que todos tengan la misma relación de aspecto: */
  &:after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
`;

export const Grid = styled.div`
  padding-top: 32px;
`;

export const Image = styled.img`
  object-fit: cover;
  height: 100%;
  width: 100%;
  position: absolute;
`;
