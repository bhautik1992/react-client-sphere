import { theme } from 'style/Theme';

import { css } from 'styled-components';

export const responsive = (media: keyof typeof theme.device) => {
  return (styles: TemplateStringsArray | string) => css`
    @media only screen and (max-width: ${theme.device[media]}) {
      ${styles}
    }
  `;
};

export const linearGradient = (
  degrees: number,
  colorOne: string,
  colorTwo: string,
  colorTwoPercent: string
) => css`
  background-image: -moz-linear-gradient(
    ${degrees}deg,
    ${colorOne} 0%,
    ${colorTwo} ${colorTwoPercent}
  );
  background-image: -webkit-linear-gradient(
    ${degrees}deg,
    ${colorOne} 0%,
    ${colorTwo} ${colorTwoPercent}
  );
  background-image: -o-linear-gradient(
    ${degrees}deg,
    ${colorOne} 0%,
    ${colorTwo} ${colorTwoPercent}
  );
  background-image: -ms-linear-gradient(
    ${degrees}deg,
    ${colorOne} 0%,
    ${colorTwo} ${colorTwoPercent}
  );
  background-image: linear-gradient(${degrees}deg, ${colorOne} 0%, ${colorTwo} ${colorTwoPercent});
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='${colorOne}', endColorstr='${colorTwo}', GradientType=1);
`;

export const boxShadow = (boxShadowValue: any) => css`
  -webkit-box-shadow: ${boxShadowValue};
  -moz-box-shadow: ${boxShadowValue};
  box-shadow: ${boxShadowValue};
`;
