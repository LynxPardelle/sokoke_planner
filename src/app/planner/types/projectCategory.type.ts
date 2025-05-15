import { TColor } from '../../shared/types/colors.type';
import { TUser } from '../../user/types/user.type';
import { TProjectSubCategory } from './projectSubCategory.type';

export type TProjectCategory = {
  _id: string;
  name: string;
  description: string;
  subCategories: (TProjectSubCategory | string)[];
  owners: (TUser | string)[];
  createdAt: Date;
  updatedAt: Date;
} & TColor;
export function isTProjectCategory(arg: any): arg is TProjectCategory {
  return (
    arg !== 'undefined' &&
    arg._id !== 'undefined' &&
    arg.name !== 'undefined' &&
    arg.description !== 'undefined' &&
    arg.subCategories !== 'undefined' &&
    arg.owners !== 'undefined' &&
    arg.createdAt !== 'undefined' &&
    arg.updatedAt !== 'undefined'
  );
}
export function isTProjectCategoryArray(arg: any): arg is TProjectCategory[] {
  return Array.isArray(arg) && arg.every((v) => isTProjectCategory(v));
}
export function asTProjectCategory(arg: any): TProjectCategory {
  if (isTProjectCategory(arg)) {
    return arg;
  }
  throw new Error('Invalid TProjectCategory');
}
