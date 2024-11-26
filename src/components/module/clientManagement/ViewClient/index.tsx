import { DetailWrapper } from './style';

import { DownOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Col, Popconfirm, Row, Tag, message } from 'antd';
import { Link, useParams } from 'react-router-dom';

import StyledBreadcrumb from 'components/layout/breadcrumb';

import { IClient, IClientReq } from 'services/api/client/types';
import { useClientDetail, useClientStatus } from 'services/hooks/client';
import { clientKeys } from 'services/hooks/queryKeys';

import { IApiError } from 'utils/Types';
import { ROUTES } from 'utils/constants/routes';
import { renderTagColor } from 'utils/renderColor';

const BreadcrumbsPath = [
  {
    title: <Link to={ROUTES.clientManagement}>Client</Link>
  },
  {
    title: 'Client Detail'
  }
];

const ViewClient = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: clientData } = useClientDetail(Number(id));
  const { mutate } = useClientStatus();

  const handleConfirm = () => {
    const data = {
      status: clientData?.status === 'active' ? 'inactive' : 'active',
      clientId: Number(id)
    };

    mutate(data, {
      onSuccess: (res) => {
        // invalidate client list
        queryClient.invalidateQueries({
          predicate: (query) => {
            return [clientKeys.clientList({} as IClientReq)].some((key) => {
              return ((query.options.queryKey?.[0] as string) ?? query.options.queryKey)?.includes(
                key[0]
              );
            });
          }
        });

        // set status in client detail
        queryClient.setQueryData<IClient>(clientKeys.clientDetail(Number(id)), () => {
          return { ...res } as unknown as IClient;
        });
      },
      onError: (err: IApiError) => {
        message.error(err.message);
      }
    });
  };

  return (
    <>
      <StyledBreadcrumb items={BreadcrumbsPath}></StyledBreadcrumb>
      <div className="shadow-paper">
        <div className="pageHeader">
          <h2 className="pageTitle">Client Detail</h2>
          <Popconfirm
            title="Status"
            placement="bottomLeft"
            description={`Are you sure to ${
              clientData?.status === 'active' ? 'inactive' : 'active'
            } this client?`}
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleConfirm()}
          >
            <Tag color={renderTagColor(clientData?.status === 'active' ? 'Active' : 'Inactive')}>
              {clientData?.status === 'active' ? 'Active' : 'Inactive'} <DownOutlined />
            </Tag>
          </Popconfirm>
        </div>
        <DetailWrapper>
          <Row className="clientRow">
            <Col xs={6}>
              <h4>Name</h4>
              <p>{clientData?.name ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Email Address</h4>
              <p>{clientData?.email ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Phone</h4>
              <p>{clientData?.phone ?? '-'}</p>
            </Col>
          </Row>
          <Row className="clientRow">
            <Col xs={6}>
              <h4>Gender</h4>
              <p>{clientData?.gender ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Country</h4>
              <p>{clientData?.country ?? '-'}</p>
            </Col>
            <Col xs={6}>
              <h4>Address</h4>
              <p>{clientData?.address ?? '-'}</p>
            </Col>
          </Row>
          <Row className="clientRow">
            <Col xs={6}>
              <h4>No. of Projects</h4>
              <p>{clientData?.projects?.length ?? '-'}</p>
            </Col>
          </Row>
        </DetailWrapper>
      </div>
    </>
  );
};

export default ViewClient;
