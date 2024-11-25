import { Modal } from 'antd';

import { styled } from 'styled-components';

export const CommonModalStyle = styled(Modal)`
  .ant-modal-content {
    border-radius: 16px;
    padding: 40px 30px 30px;
    .ant-modal-close {
      &:hover {
        background-color: transparent;
      }
    }
  }
  .ant-modal-header,
  .modal-header {
    margin-bottom: 16px;
    .ant-modal-title,
    .modal-title {
      text-align: center;
      font-family: var(--font-ibm-sans);
      font-size: 24px;
      font-style: normal;
      font-weight: 700;
      line-height: 30px;
      color: var(--dark-color);
    }
  }
  .ant-modal-body,
  .modal-body {
    .modal-text {
      color: var(--dark-color);
      font-family: var(--font-ibm-sans);
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      &.bold {
        font-weight: 600;
      }
    }
    .modal-subtitle {
      color: var(--dark-color);
      font-family: var(--font-ibm-sans);
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      &.bold {
        font-weight: 600;
      }
    }
    .picture-wrapper {
      width: 100%;
      height: 100%;
      position: relative;
      display: inline-block;
      text-align: center;
      vertical-align: middle;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  .ant-modal-footer,
  .modal-footer {
    width: 100%;
    margin-top: 30px;
  }
`;

export const ModalWrapper = styled(Modal)`
  &.ant-modal {
    &.text-center {
      text-align: center;
    }
    &.common-modal {
      ${CommonModalStyle}
      &.welcome {
        .ant-modal-content {
          padding: 30px;
        }
        .modal-header {
          margin-bottom: 20px;
          .modal-title {
            font-size: 40px;
            line-height: 44px;
            text-transform: uppercase;
          }
        }
        .ant-modal-body {
          .modal-subtitle {
            margin-top: 20px;
          }
          .picture-wrapper {
            margin-bottom: 23px;
          }
        }
      }

      &.list-modal {
        .listWrapper {
          margin-top: 30px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          .listTitle {
            margin-bottom: 8px;
            padding-inline-start: 16px;
            position: relative;
            font-family: var(--font-ibm-sans);
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: 24px;
            text-transform: uppercase;
            color: var(--dark-color);
            &::before {
              content: '';
              position: absolute;
              width: 6px;
              height: 6px;
              background-color: var(--theme-color);
              border-radius: 50%;
              left: 0;
              top: 0;
              bottom: 0;
              margin: auto 0;
            }
          }
          .listDesc {
            padding-inline-start: 16px;
            font-family: var(--font-ibm-sans);
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px;
            color: var(--dark-color);
          }
        }
      }

      &.create-tag {
        .ant-modal-content {
          padding: 30px;
        }
        .modal-header {
          margin-bottom: 10px;
        }
        .ant-modal-body {
          .picture-wrapper {
            margin-bottom: 30px;
          }
        }
      }

      &.success-modal {
        text-align: center;
        .ant-modal-content {
          padding: 44px 30px 30px;
        }
        .ant-modal-header {
          margin-bottom: 10px;
        }
        .ant-modal-body {
          .modal-text {
            .houseNo {
              text-transform: uppercase;
            }
          }
          .picture-wrapper {
            margin-bottom: 20px;
          }
        }
      }

      &.save-tag {
        .ant-modal-content {
          padding: 30px;
        }
        .picture-wrapper {
          margin-bottom: 30px;
        }
        .modal-header {
          margin-bottom: 10px;
        }
      }

      &.verify-link {
        .ant-modal-content {
          padding: 30px;
        }
        .picture-wrapper {
          margin-bottom: 30px;
        }
        .modal-header {
          margin-bottom: 10px;
        }
      }

      &.view-all-tags {
        .ant-modal-content {
          padding: 0;
          min-height: 570px;
          .ant-modal-header {
            padding: 40px 16px 20px;
            border-bottom: 1px solid #e3e3e3;
          }
          .ant-modal-body {
            padding: 16px;
          }
        }
      }
    }
  }
`;
