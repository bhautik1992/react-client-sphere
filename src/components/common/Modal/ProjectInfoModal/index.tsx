import { Table } from 'antd';
import dayjs from 'dayjs';

import { IProject } from 'services/api/project/types';

import { DATE_FORMAT } from 'utils/constants/dayjs';

const ProjectInfoTable = ({ record }: { record: IProject }) => {
  const dataSource = [
    {
      name: record.name,
      startDate: record.startDate ? dayjs(record.startDate).format(DATE_FORMAT) : '-',
      hours: record.projectHours,
      rate: record.hourlyMonthlyRate,
      cost: record.projectCost
    },
    ...(record.crs ?? []).map((cr) => ({
      name: cr.name,
      startDate: cr.startDate ? dayjs(cr.startDate).format(DATE_FORMAT) : '-',
      hours: cr.crHours,
      rate: cr.hourlyMonthlyRate,
      cost: cr.crCost
    }))
  ];
  const totalCost = dataSource.reduce((sum, record) => sum + +record.cost, 0);
  const totalRow = {
    name: '',
    startDate: '',
    hours: '',
    rate: 'Total Cost',
    cost: totalCost.toFixed(2)
  };
  const fullDataSource = [...dataSource, totalRow];
  const columns = [
    {
      title: 'Project/CR name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Project/CR Date',
      dataIndex: 'startDate',
      key: 'startDate'
    },
    {
      title: 'Project/CR Hours',
      dataIndex: 'hours',
      key: 'hours'
    },
    {
      title: 'Project/CR Rate',
      dataIndex: 'rate',
      key: 'rate'
    },
    {
      title: 'Project/CR Cost',
      dataIndex: 'cost',
      key: 'cost'
    }
  ];

  return <Table dataSource={fullDataSource} columns={columns} rowKey="name" />;
};

export default ProjectInfoTable;
