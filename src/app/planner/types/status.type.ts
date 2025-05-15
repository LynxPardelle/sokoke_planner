import { TColor } from '../../shared/types/colors.type';
import { TUser } from '../../user/types/user.type';

export type TStatus = {
  _id: string;
  name: string;
  description: string;
  owners: (TUser | string)[];
  createdAt: Date;
  updatedAt: Date;
} & TColor;
export function isTStatus(arg: any): arg is TStatus {
  return (
    arg !== 'undefined' &&
    arg._id !== 'undefined' &&
    arg.name !== 'undefined' &&
    arg.description !== 'undefined' &&
    arg.owners !== 'undefined' &&
    arg.createdAt !== 'undefined' &&
    arg.updatedAt !== 'undefined'
  );
}
export function isTStatusArray(arg: any): arg is TStatus[] {
  return Array.isArray(arg) && arg.every((v) => isTStatus(v));
}
export function asTStatus(arg: any): TStatus {
  if (isTStatus(arg)) {
    return arg;
  }
  throw new Error('Invalid TStatus');
}
