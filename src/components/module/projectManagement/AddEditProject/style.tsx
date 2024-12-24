import styled from 'styled-components';

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  .submitButton {
    margin-left: 20px;
  }
`;

export const Wrapper = styled.div`
  form {
    .otherAction {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
`;

export const MileStoneWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 35px;
  .addMileStone {
    margin-left: 20px;
  }
`;
