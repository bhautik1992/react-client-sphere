import { theme } from 'style/Theme';

import { styled } from 'styled-components';

export const CommentWrapper = styled.div`
  min-height: 100px;
  max-height: 400px;
  height: 100%;
  overflow-y: auto;
  .commentList {
    margin-bottom: 25px;
    .commentUser {
      margin-top: 10px;
      font-weight: 600;
      .commentDate {
        font-weight: 500;
        color: ${theme.color.dark};
      }
    }
  }
`;
