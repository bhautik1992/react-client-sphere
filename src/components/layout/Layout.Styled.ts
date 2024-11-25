import { Layout } from 'antd';
import { theme } from 'style/Theme';

import { styled } from 'styled-components';

export const StyledLayout = styled(Layout)`
  --headerHeight: 60px;
  --footerHeight: 60px;
  --bodyHeight: calc(100vh - var(--headerHeight) - var(--footerHeight));

  &.ant-layout {
    min-height: 100vh;
    /* Sidebar */
    .ant-layout-sider {
      min-height: 100vh;
      .logoWrapper {
        height: var(--headerHeight);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          &.logoSm {
            max-width: 30px;
            max-height: 30px;
          }
        }
      }
      .ant-menu {
        &.sidebarMenu {
          height: var(--bodyHeight);
          overflow: auto;
          .ant-menu-item {
            svg {
              margin-right: 15px;
              width: 16px;
            }
          }
        }
      }
      .ant-layout-sider-trigger {
        height: var(--footerHeight);
        line-height: var(--footerHeight);
      }
    }
    /* Header */
    .ant-layout-header {
      height: var(--headerHeight);

      .header-title {
        /* text-align: left; */
        font-weight: 400;
        font-size: 20px;
        line-height: 26px;
        color: ${theme?.color?.black};
      }

      .profile-avatar {
        padding: 8px;
        border: 1px solid ${theme?.color?.black};
        background-color: ${theme?.color?.white};
      }
    }

    /* Content */
    .ant-layout-content {
      height: var(--bodyHeight);
      overflow: auto;
    }
    /* Footer */
    .ant-layout-footer {
      height: var(--footerHeight);
      text-align: center;
    }
  }
  .content-body {
    padding: 15px 0;
  }
  .content-wrap {
    padding: 0 15px;
  }
`;
