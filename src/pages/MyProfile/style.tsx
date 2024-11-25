import { styled } from 'styled-components';

export const Wrapper = styled.section`
  .pageHeaderButton {
    width: 380px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
  .profileDetail {
    align-items: center;
    .ant-avatar {
      width: 150px;
      height: 150px;
    }
    .detailRow {
      margin-bottom: 35px;
      p {
        margin-top: 10px;
      }
    }
  }
`;
