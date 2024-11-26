import { styled } from 'styled-components';

export const DetailWrapper = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  &.userDetail {
    margin-top: 60px;
  }
  .companyRow {
    justify-content: space-between;
    h4 {
      margin-bottom: 5px;
    }
    audio {
      width: 400px;
    }
    p {
      line-height: 22px;
    }
    a {
      color: #074992;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 22px;
    }
  }
`;
