import { CommentWrapper } from './style';

import { Col } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { useParams } from 'react-router-dom';

import { IIncidentComment } from 'services/api/incident/type';
import { useIncidentCommentList } from 'services/hooks/incident';

import { DATE_MONTH_FORMAT } from 'utils/constants/dayjs';

const CommentList: React.FC = () => {
  const { id } = useParams();
  const { data: commmets } = useIncidentCommentList(id ?? '');

  return (
    <CommentWrapper>
      {(commmets?.comments ?? []).length > 0
        ? commmets?.comments?.map((detail: IIncidentComment) => (
            <Col className="commentList" key={detail?._id}>
              <p>{detail?.content}</p>
              <p className="commentUser">
                {`${detail?.user?.firstName} ${detail?.user?.lastName}`},{' '}
                {detail?.user?.designation}{' '}
                <strong> {dayjs(detail?.createdAt).format(DATE_MONTH_FORMAT)}</strong>
              </p>
            </Col>
          ))
        : 'Comments not available'}
    </CommentWrapper>
  );
};

export default CommentList;
