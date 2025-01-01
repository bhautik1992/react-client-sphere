import { styled } from 'styled-components';

export const Wrapper = styled.section`
  .pageHeaderButton {
    width: 100%;
    max-width: 335px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  .submitButton {
    margin-right: 20px;
  }
`;
