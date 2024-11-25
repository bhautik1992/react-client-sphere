import { ReactNode } from 'react';

export interface IModalProps {
  children?: ReactNode;
  open?: boolean;
  title?: string;
  width?: number;
  className?: string;
  onOk?: () => void;
  onCancel?: () => void;
  footer?: ReactNode;
  centered?: boolean;
  closeIcon?: ReactNode;
  closable?: boolean;
  destroyOnClose?: boolean;
  maskClosable?: boolean;
  modalTitle?: string;
  modalDesc?: string;
}
