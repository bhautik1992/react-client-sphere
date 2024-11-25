import { theme } from 'style/Theme';

import styled from 'styled-components';

export const Wrapper = styled.div`
  .formTitle {
    margin: auto;
    width: 100%;
    height: 100%;
    .title {
      width: fit-content;
      /* font-size: 14px; */
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
      margin-bottom: 26px;
      letter-spacing: 0.1em;
      color: ${theme?.color?.primary};
      font-family: ${theme?.font?.family?.sans};
      text-align: start;
      padding: 5px 0;
      border-bottom: 2px solid ${theme?.color?.primary};
    }
    form {
      margin: 22px 0;
      .otherAction {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .valid {
        .success {
          color: ${theme?.color?.success};
        }
        .error {
          color: ${theme?.color?.danger};
        }
      }
      a {
        font-size: 16px;
      }
    }
  }
`;
