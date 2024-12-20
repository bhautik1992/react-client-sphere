import { Table, TableProps } from 'antd';

import styled from 'styled-components';

export const TableWrapper = styled.div`
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

export const CustomTable = styled(Table)<TableProps<any>>`
  .ant-table-thead > tr > th {
    border: 1px solid #7878ff !important;
    background-color: transparent !important;
  }
`;
