import { Table } from 'antd';

import { styled } from 'styled-components';

export const StyledTable = styled(Table)`
  &.ant-table-wrapper {
    .ant-spin-container {
      .ant-table {
        &.ant-table-small {
        }
        &.ant-table-bordered {
          .ant-table-container {
            .ant-table-content {
              table {
                .ant-table-tbody {
                  tr {
                    &.green td {
                      background-color: #daf4e4;
                    }
                    &.yellow td {
                      background-color: #fbf2d7;
                    }
                    &.blue td {
                      background-color: #deedff;
                    }
                    &.purple td {
                      background-color: #ffe6e4;
                    }
                    td {
                      .table-status-tag {
                        width: 100%;
                        border-radius: 20px;
                        line-height: 30px;
                        text-align: center;
                        font-size: 14px;
                        max-width: 120px;
                        cursor: pointer;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      ul.ant-pagination {
        &.ant-table-pagination {
          .ant-pagination-total-text {
          }
          li {
            & + li {
              margin-inline-end: 6px;
            }
          }
        }
      }
    }
  }
`;
