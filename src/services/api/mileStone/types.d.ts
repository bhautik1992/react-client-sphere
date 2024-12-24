import { Key } from 'react';

import { IClient } from '../client/types';
import { ICompany } from '../company/types';
import { IEmployee } from '../employee/types';
import { IProject } from '../project/types';

interface IMileStone {
  id: number;
  name: string;
  details: string;
  PISHours: number;
  PMSHours: number;
  cost: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAddMileStoneReq {
  id?: number;
  name: string;
  details: string;
  PISHours: number;
  PMSHours: number;
  cost: number;
  startDate: string;
  endDate: string;
}
