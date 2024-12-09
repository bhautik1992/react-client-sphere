import { styled } from 'styled-components';

export const DetailWrapper = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  &.employeeDetail {
    margin-top: 60px;
  }
  .crRow {
    justify-content: space-between;
    h4 {
      margin-bottom: 5px;
    }
    audio {
      width: 400px;
    }
    .ant-image {
      margin-right: 15px;
    }
  }
`;
