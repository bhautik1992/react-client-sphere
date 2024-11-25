import { CloseCircleFilled, ExclamationCircleFilled, RightCircleFilled } from '@ant-design/icons';
import { Modal, ModalProps } from 'antd';
import React, { PropsWithChildren, ReactElement, ReactNode, useState } from 'react';

import { renderTagColor } from 'utils/renderColor';

interface ICommonModalProps {
  type?: 'info' | 'success' | 'error' | 'warning' | 'confirm';
  className?: string;
  title?: string;
  content?: string | ReactNode;
  noBtnTxt?: string;
  yesBtnTxt?: string;
  onConfirm?: () => void;
  confirmLoading?: boolean;
  width?: number;

  isOpen?: boolean;
  setIsOpen?: (k?: boolean) => void;
}

const CommonModal: React.FC<PropsWithChildren<ICommonModalProps & ModalProps>> = ({
  children,
  className,
  title,
  content,
  noBtnTxt = 'No',
  yesBtnTxt = 'Yes',
  onConfirm,
  confirmLoading = false,
  width = 400,
  type,

  isOpen,
  setIsOpen
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);

    setIsOpen?.(true);
  };

  const handleClose = (_?: unknown, reason?: string) => {
    if (reason === 'backdropClick') return;

    setOpen(false);

    setIsOpen?.(false);
  };

  const modalIcon = () => {
    if (type === 'success') {
      return <RightCircleFilled style={{ color: renderTagColor(type), marginRight: '10px' }} />;
    } else if (type === 'error') {
      return <CloseCircleFilled style={{ color: renderTagColor(type), marginRight: '10px' }} />;
    } else if (type === 'confirm' || type === 'warning' || type === 'info') {
      return (
        <ExclamationCircleFilled style={{ color: renderTagColor(type), marginRight: '10px' }} />
      );
    } else {
      return;
    }
  };

  return (
    <>
      {children &&
        React.cloneElement(children as ReactElement, {
          ...(children as ReactElement).props,
          onClick: handleOpen
        })}
      <Modal
        open={Boolean(open || isOpen)}
        className={className}
        title={[
          <>
            {type && modalIcon()}
            {title}
          </>
        ]}
        confirmLoading={confirmLoading}
        onCancel={handleClose}
        onOk={onConfirm}
        okText={yesBtnTxt}
        cancelText={noBtnTxt}
        destroyOnClose={true}
        width={width}
        centered
      >
        {content}
      </Modal>
    </>
  );
};

export default CommonModal;
