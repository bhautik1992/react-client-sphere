import { CloseCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { ModalWrapper } from '../Modal.Styled';
import { IModalProps } from '../types';

const DeleteModal = ({
  open,
  onOk,
  onCancel,
  closeIcon,
  width,
  modalTitle,
  modalDesc
}: IModalProps) => {
  return (
    <ModalWrapper
      width={width ?? 400}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      centered={true}
      className="common-modal delete-modal"
      closeIcon={closeIcon ?? <CloseCircleOutlined />}
      footer={[
        <div key={3} className="d-flex justify-content-end gap-15">
          <Button onClick={onCancel} type="default" htmlType="button" size="middle">
            No
          </Button>
          <Button onClick={onOk} type="primary" htmlType="button" size="middle">
            Yes
          </Button>
        </div>
      ]}
      title={[
        <div key={1} className="modal-header">
          <h2 className="modal-title">{modalTitle}</h2>
        </div>
      ]}
    >
      <div className="content-wrapper">
        <p className="modal-subtitle ">{modalDesc}</p>
      </div>
    </ModalWrapper>
  );
};

export default DeleteModal;
