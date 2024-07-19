import { TColor } from '../../shared/types/colors.type';

export type TStatus = {
  _id: string;
  name: string;
  description: string;
} & TColor;
