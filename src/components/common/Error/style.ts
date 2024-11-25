import { theme } from 'style/Theme';

import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 30px);
  .error-content {
    text-align: center;
    margin-top: 1em;
    h3 {
      margin-bottom: 0.3em;
      font-weight: 500;
      font-size: clamp(1.5vw, 26px, 6vw);
      color: ${theme?.color?.primary};
      opacity: 0.8;
    }
    p {
      margin-bottom: 1.2em;
      font-weight: 400;
      font-size: clamp(0.8vw, 16px, 3vw);
      color: ${theme?.color?.primary};
      opacity: 0.6;
    }
  }
`;
