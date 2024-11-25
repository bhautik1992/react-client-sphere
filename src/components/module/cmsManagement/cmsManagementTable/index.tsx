import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import { CommonTable } from 'components/common/Table';

import { ICMS } from 'services/api/cms/types';
import { useCmsList } from 'services/hooks/cms';

import { DATE_FORMAT } from 'utils/constants/dayjs';
import { ROUTES } from 'utils/constants/routes';

const CMSManagementTable = () => {
  const navigate = useNavigate();

  const { data: cmsList, isLoading } = useCmsList();

  const columns: ColumnsType<ICMS> = [
    {
      title: 'Page name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Date created',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (_, record: ICMS) => (
        <>{record?.updatedAt ? dayjs(record?.updatedAt).format(DATE_FORMAT) : '-'}</>
      )
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      className: 'text-center',
      render: (_, record: ICMS) => (
        <>
          <Tooltip title="View cms" placement="top" trigger="hover">
            <Button
              type="text"
              size="small"
              className="cta_btn table_cta_btn"
              icon={<EyeOutlined />}
              onClick={() => navigate(`${ROUTES.cms}/${record?.key}`)}
            />
          </Tooltip>
          <Tooltip title="Edit cms" placement="top" trigger="hover">
            <Button
              type="text"
              size="small"
              className="cta_btn table_cta_btn"
              icon={<EditOutlined />}
              onClick={() => {
                navigate(`${ROUTES.editCms}/${record?.key}`);
              }}
            />
          </Tooltip>
        </>
      )
    }
  ];

  return (
    <CommonTable
      bordered
      columns={columns}
      dataSource={
        (cmsList ?? []).length > 0
          ? cmsList?.filter((item) => item?.key !== 'contactNumberForApp')
          : []
      }
      loading={isLoading}
      showSizeChanger={false}
    />
  );
};

export default CMSManagementTable;
