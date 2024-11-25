import { Col, Row, Space } from 'antd';
import { ReactNode } from 'react';

interface IProps {
  pageTitle?: string;
  button?: ReactNode;
  gap?: number;
}

const ContentHeader = (props: IProps) => {
  return (
    <div className="shadow-paper pad-md">
      <Row gutter={[0, 15]} align={'middle'}>
        <Col xs={props?.button ? 18 : 24}>
          <h2 className="pageTitle">{props?.pageTitle}</h2>
        </Col>
        {props?.button && (
          <Col xs={6}>
            <div className="text-right">
              <Space size={props?.gap ?? 10}>{props?.button}</Space>
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default ContentHeader;
