import { TColor } from '../../shared/types/colors.type';

export type TProjectSubCategory = {
  _id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
} & TColor;
export function isTProjectSubCategory(arg: any): arg is TProjectSubCategory {
  return (
    arg !== 'undefined' &&
    arg._id !== 'undefined' &&
    arg.name !== 'undefined' &&
    arg.description !== 'undefined' &&
    arg.createdAt !== 'undefined' &&
    arg.updatedAt !== 'undefined'
  );
}
export function isTProjectSubCategoryArray(
  arg: any,
): arg is TProjectSubCategory[] {
  return Array.isArray(arg) && arg.every((v) => isTProjectSubCategory(v));
}
export function asTProjectSubCategory(arg: any): TProjectSubCategory {
  if (isTProjectSubCategory(arg)) {
    return arg;
  }
  throw new Error('Invalid TProjectSubCategory');
}
