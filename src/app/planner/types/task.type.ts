import { TColor } from '../../shared/types/colors.type';
import { TStatus } from './status.type';

export type TTask = {
  _id: string;
  name: string;
  description: string;
  status: TStatus;
  tasks: TTask[];
  startDate: Date;
  endDate: Date;
  approximateTimeProjection: number;
  lastCheckStatus: Date;
  priority: number;
  impact: number;
  impactDescription: string;
  createdAt: Date;
  updatedAt: Date;
} & TColor;
