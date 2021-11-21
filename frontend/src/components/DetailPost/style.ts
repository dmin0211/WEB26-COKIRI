import styled from '@emotion/styled';

import { Col } from 'src/components/Grid';

interface Props {
  isImage: boolean;
}
const Wrapper = styled.div<Props>`
  display: flex;
  justify-content: ${({ isImage }) => (isImage ? 'unset' : 'center')};
  > button {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 1;
  }
`;

const ImageSection = styled.div`
  position: absolute;
  display: flex;
  left: 0;
  justify-content: center;
  align-items: center;
  background: #222222;
  width: calc(100vw - 410px);
  height: 100vh;
`;

const PostInfoSection = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 410px;
  height: 100vh;
  ${Col} {
    height: 99vh;
  }
`;

export { Wrapper, ImageSection, PostInfoSection };
