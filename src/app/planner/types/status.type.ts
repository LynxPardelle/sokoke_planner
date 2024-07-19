import { TColor } from '../../core/types/colors.type';

export type TStatus = {
  _id: string;
  name: string;
  description: string;
} & TColor;
