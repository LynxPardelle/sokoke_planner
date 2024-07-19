import { TColor } from '../../core/types/colors.type';

export type TProjectSubCategory = {
  _id: string;
  name: string;
  description: string;
} & TColor;
