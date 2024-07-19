import { TColor } from '../../shared/types/colors.type';
import { TProjectSubCategory } from './projectSubCategory.type';

export type TProjectCategory = {
  _id: string;
  name: string;
  description: string;
  subCategories: TProjectSubCategory[];
  createdAt: Date;
  updatedAt: Date;
} & TColor;
