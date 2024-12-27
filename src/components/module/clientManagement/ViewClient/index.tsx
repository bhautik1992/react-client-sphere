import { DetailWrapper } from './style';

import { useQueryClient } from '@tanstack/react-query';
import { Col, Row, Tooltip, message } from 'antd';
import { Link, useParams } from 'react-router-dom';

import StyledBreadcrumb from 'components/layout/breadcrumb';

import { IClient, IClientReq } from 'services/api/client/types';
import { useClientDetail, useClientStatus } from 'services/hooks/client';
import { clientKeys } from 'services/hooks/queryKeys';

import { IApiError } from 'utils/Types';
import { ROUTES } from 'utils/constants/routes';
import ClientStatusDropdown from 'utils/renderDropDownStatus/clientStatusDropDown';

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

  const handleConfirm = (newStatus: string, id: number) => {
    const data = {
      status: newStatus,
      clientId: id
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
          <ClientStatusDropdown
            status={clientData?.status ?? 'active'}
            clientId={clientData?.id ?? 0}
            onStatusChange={(newStatus, crId) => handleConfirm(newStatus, crId)}
          />
        </div>
        <DetailWrapper>
          <Row className="clientRow">
            <Col xs={4}>
              <h4>First Name</h4>
              <p>{clientData?.firstName ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Last Name</h4>
              <p>{clientData?.lastName ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Nick Name</h4>
              <p>{clientData?.nickName ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Email</h4>
              <p>{clientData?.email ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Phone</h4>
              <p>{clientData?.phone ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Gender</h4>
              <p>{clientData?.gender ?? '-'}</p>
            </Col>
          </Row>
          <Row className="clientRow">
            <Col xs={4}>
              <h4>Country</h4>
              <p>{clientData?.countryName ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>State</h4>
              <p>{clientData?.stateName ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>City</h4>
              <p>{clientData?.cityName ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Company Name</h4>
              <p>{clientData?.company?.name ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Client Company</h4>
              <p>{clientData?.clientCompanyName ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Address</h4>
              <p>{clientData?.address ?? '-'}</p>
            </Col>
          </Row>
          <Row className="clientRow">
            <Col xs={4}>
              <h4>No. of Projects</h4>
              <Tooltip
                title={
                  clientData?.projects?.length ? (
                    <div>
                      {clientData.projects.map((project) => (
                        <div key={project.id}>{project.name}</div>
                      ))}
                    </div>
                  ) : (
                    'No projects available'
                  )
                }
                placement="left"
                trigger="hover"
              >
                <p>{clientData?.projects?.length ?? '-'}</p>
              </Tooltip>
            </Col>
            <Col xs={4}>
              <h4>Account Manager</h4>
              <p>
                {clientData?.accountManager?.firstName + ' ' + clientData?.accountManager?.lastName}
              </p>
            </Col>
            <Col xs={4}>
              <h4>Website</h4>
              <p>{clientData?.website ?? '-'}</p>
            </Col>
            <Col xs={4}>
              <h4>Comment</h4>
              <p>{clientData?.comment ?? '-'}</p>
            </Col>
            <Col xs={4}></Col>
            <Col xs={4}></Col>
          </Row>
        </DetailWrapper>
      </div>
    </>
  );
};

export default ViewClient;
