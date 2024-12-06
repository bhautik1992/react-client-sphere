import { Table } from 'antd';
import dayjs from 'dayjs';

import { IProject } from 'services/api/project/types';

import { DATE_FORMAT } from 'utils/constants/dayjs';

const ProjectInfoTable = ({ record }: { record: IProject }) => {
  const data = [
    {
      key: '1',
      label: 'Project Date',
      value: record?.startDate ? dayjs(record?.startDate).format(DATE_FORMAT) : '-'
    },
    {
      key: '2',
      label: 'Project Name',
      value: record?.name ?? '-'
    },
    {
      key: '3',
      label: 'Project Hours',
      value: record?.projectHours ?? '-'
    },
    {
      key: '4',
      label: 'Hourly Rate',
      value: record?.hourlyMonthlyRate ?? '-'
    },
    {
      key: '5',
      label: 'Project Cost',
      value: record?.projectCost ?? '-'
    }
  ];

  const columns = [
    {
      title: 'Field',
      dataIndex: 'label',
      key: 'label'
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value'
    }
  ];

  return (
    <Table
      bordered
      dataSource={data}
      columns={columns}
      pagination={false}
      showHeader={false}
      rowKey="key"
      size="small"
      style={{ width: '100%' }}
    />
  );
};

export default ProjectInfoTable;
