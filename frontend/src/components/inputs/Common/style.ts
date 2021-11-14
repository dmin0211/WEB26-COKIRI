import styled from '@emotion/styled';

import { ThemeType } from 'src/types';

interface Props {
  width: number;
  theme?: ThemeType;
}

const Wrapper = styled.div<Props>`
  input {
    padding: 0 24px;
    margin: 8px;
    width: ${({ width }) => (width !== 0 ? `${width}px` : 'unset')};
    height: 48px;
    font-size: 20px;
    border-radius: 50px;
    background: ${({ theme }) => theme.colors.background};
    box-shadow: inset 5px 5px 10px #3a3a3a, inset -5px -5px 10px #4e4e4e;
  }
`;

// eslint-disable-next-line import/prefer-default-export
export { Wrapper };