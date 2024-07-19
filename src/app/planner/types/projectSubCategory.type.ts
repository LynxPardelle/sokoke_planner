import { TColor } from '../../shared/types/colors.type';

export type TProjectSubCategory = {
  _id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
} & TColor;
