import { TUser } from '../../user/types/user.type';
import { TColor } from '../../core/types/colors.type';
import { TProjectCategory } from './projectCategory.type';
import { TProjectSubCategory } from './projectSubCategory.type';
import { TStatus } from './status.type';
import { TTask } from './task.type';

export type TProject = {
  _id: string;
  owners: TUser[];
  name: string;
  description: string;
  categories: TProjectCategory[];
  subCategories: TProjectSubCategory[];
  startDate: Date;
  endDate: Date | undefined;
  features: { name: string; description: string }[];
  requeriments: { name: string; description: string; done: boolean }[];
  approximateTimeProjection: number;
  status: TStatus;
  lastCheckStatus: Date;
  tasks: TTask[];
  priority: number;
  impact: number;
  impactDescription: string;
} & TColor;
