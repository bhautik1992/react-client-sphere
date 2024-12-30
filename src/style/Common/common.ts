import { createGlobalStyle } from 'styled-components';

import { theme } from '../Theme';
import { boxShadow } from './Mixin';

export const Common = createGlobalStyle`

.container-fluid {
    width: 100%;
    max-width: 100%;
    padding-left: 15px;
    padding-right: 15px;
    margin: 0 auto;
}

.container {
    width: 100%;
    max-width: 1440px;
    padding-left: 15px;
    padding-right: 15px;
    margin: 0 auto;

    &.lg {
        width: 1290px;
    }

    &.md {
        width: 908px;
    }
}

.shadow-paper {
	height: 100%;
	background: ${theme.color.white};
	padding: 20px;
	border-radius: 10px;
    ${boxShadow('10px 10px 20px 5px rgba(0, 0, 0, 0.05)')}

	&.auto-height {
		height: auto;
	}

	.shadow-paper-scroll {
		height: 100%;
		overflow: hidden;
		overflow-y: auto;
		margin: 0 -20px;
		padding: 0 20px;
	}

	+.shadow-paper {
		margin-top: 20px;
	}

    &.no-bg{
        background-color: transparent;
    }

    &.pad-sm{
        padding: 10px 20px;
    }

    &.pad-md{
        padding: 15px 20px;
    }

	&.no-padd {
		padding: 0;
	}

	.heading-row {
		padding: 20px 0;
	}
}

.pageHeader {
    padding-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .ant-tag{
        width: 100%;
                        border-radius: 20px;
                        line-height: 30px;
                        text-align: center;
                        font-size: 14px;
                        max-width: 110px;
                        cursor: pointer;
    }
  }
  .ant-picker-range , .ant-picker{
    padding: 10px 11px;
    width: 100%;
  }

.filterForm {
    margin: 10px 0 10px 0;
    border-radius: 6px;
    border: 1px solid ${theme.color.primary};
    padding: 10px;
    .ant-form-item {
      margin-bottom: 10px;
    }
}

/* hide spin button from number input */
 /* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

/* phone input css */
.phoneInput{
    background: #ffffff;
    border-width: 1px;
    border-style: solid;
    border-color: #FFC7A0;
    position: relative;
    display: inline-flex;
    width: 100%;
    min-width: 0;
    padding: 10px 11px;
    color: #000000;
    font-size: 14px;
    line-height: 1;
    border-radius: 8px;
    transition: all 0.2s;

&::-webkit-input-placeholder { /* Chrome/Opera/Safari */
  color: ${theme?.color?.primaryLight};
}
&::-moz-placeholder { /* Firefox 19+ */
  color: ${theme?.color?.primaryLight};
}
&:-ms-input-placeholder { /* IE 10+ */
  color: ${theme?.color?.primaryLight};
}
&:-moz-placeholder { /* Firefox 18- */
  color: ${theme?.color?.primaryLight};
}}
/* Text Alignment */
.text-center {
    text-align: center;
}

.text-left {
    text-align: left;
}

.text-right {
    text-align: right;
}

/* Text Colors */
.text-success {
    color: ${theme.color.success};
}

.text-danger {
    color: ${theme.color.danger};
}

.text-warning {
    color: ${theme.color.warning};
}

.text-info {
    color: ${theme.color.info};
}

/* Width & Height */
.w-100 {
    width: 100%;
}

.max-w-100 {
    max-width: 100%;
}

.h-100 {
    height: 100%;
}

.h-100vh {
    min-height: 100vh;
}

`;
