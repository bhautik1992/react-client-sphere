import { theme } from 'style/Theme';

import { styled } from 'styled-components';

export const AuthWrapper = styled.section`
  background-color: ${theme?.color?.white};
  &.authLayout {
    padding: 16px;
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    .authWrapper {
      background-image: url('/asset/background_image.png');
      background-repeat: no-repeat;
      background-size: cover;
      min-height: 600px;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-direction: column;
      img {
        height: 90px;
        width: 160px;
        display: block;
        margin: 0px auto;
      }
      .contentWrapper {
        margin: auto;
        max-width: 600px;
        width: 100%;
        &.authBg {
          /* background-color: ${theme?.color?.white}; */
          border-radius: 10px;
          padding: 40px 30px;
          position: relative;
        }

        /* .title {
          margin: 0 0 50px;
          color: #ffffff;
        } */
      }
    }
  }
`;
