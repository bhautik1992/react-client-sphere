import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { SizeType } from 'antd/es/config-provider/SizeContext';

type NameType = string | number | (string | number)[];
export interface IRenderInputProps {
  //  COLUMN
  col?: any;
  colClassName?: string;
  colOffSet?: any;
  offSetPull?: any;
  // FORM_ITEM
  name?: NameType;
  label?: string;
  rules?: any;
  help?: React.ReactNode | string;
  // FORM_INPUT
  type?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  min?: number | string;
  max?: number | string;
  minLength?: number;
  maxLength?: number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  addonAfter?: any;
  addonBefore?: any;
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
  allowClear?: any;
  size?: SizeType;
  required?: boolean;
  defaultValue?: string;
  tooltip?: any;
}

export interface IRenderCheckBox {
  col?: any;
  colClassName?: string;
  colOffSet?: any;
  name?: NameType;
  label?: string;
  className?: string;
  checkBoxName?: string;
  required?: boolean;
  rules?: any;
  children?: any;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (event) => void;
  checked?: boolean;
  initialValue?: boolean;
  value?: boolean;
}

export interface IRenderCheckboxProps {
  col?: any;
  colClassName?: string;
  colOffSet?: any;
  name?: string | number | (string | number)[];
  label?: string;
  className?: string;
  checkboxName?: string;
  required?: boolean;
  value?: any;
  onChange?: (checkedValues: CheckboxValueType[]) => void;
  optionLabel?: any;
  rules?: any;
  disabled?: boolean;
  defaultValues?: any;
}

export interface IRenderSelectProps {
  col?: any;
  colClassName?: string;
  colOffSet?: any;
  name?: NameType;
  label?: string;
  rules?: any;
  required?: boolean;
  onChange?: any;
  value?: any;
  className?: string;
  optionLabel?: any;
  disabled?: boolean;
  onSelect?: any;
  showSearch?: boolean;
  mode?: any;
  placeholder?: string;
  allowClear?: boolean;
  defaultValue?: any;
  prefixIcon?: any;
  suffixIcon?: any;
}
