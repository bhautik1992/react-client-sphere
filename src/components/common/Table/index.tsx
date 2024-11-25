import { StyledTable } from './style';

import { TablePaginationConfig, TableProps } from 'antd';
import React from 'react';

interface CustomProps {
  summaryRow?: React.ReactNode;
  loading?: boolean;
  total?: number;
  currentPage?: number;
  showSizeChanger?: boolean;
}

export const TableSummaryCell: React.FC<{
  index: number;
  colSpan: number;
  component: React.ReactNode;
}> = ({ index, colSpan, component }) => (
  <StyledTable.Summary.Cell index={index} colSpan={colSpan}>
    {component}
  </StyledTable.Summary.Cell>
);

const defaultPaginationSettings: Partial<TablePaginationConfig> = {
  showQuickJumper: false,
  defaultPageSize: 10,
  pageSizeOptions: ['10', '15', '20'],
  size: 'small',
  position: ['bottomRight'],
  showTotal: (total) => `Total ${total} items`
};

export const CommonTable: React.FC<TableProps<any> & CustomProps> = (props) => {
  const {
    pagination,
    summaryRow,
    loading,
    total,
    rowKey,
    currentPage,
    showSizeChanger = true
  } = props;

  return (
    <StyledTable
      loading={loading}
      size="small"
      scroll={{ x: true }}
      {...props}
      rowKey={rowKey}
      pagination={{
        ...defaultPaginationSettings,
        ...pagination,
        total: total,
        current: currentPage ?? 1,
        showSizeChanger: showSizeChanger
      }}
      summary={
        summaryRow
          ? () => (
              <StyledTable.Summary fixed="top">
                <StyledTable.Summary.Row>{summaryRow}</StyledTable.Summary.Row>
              </StyledTable.Summary>
            )
          : undefined
      }
    />
  );
};
