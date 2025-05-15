export type TUser = {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  verifyToken: string;
  verified: boolean;
};
export function isTUser(arg: any): arg is TUser {
  return (
    arg !== 'undefined' &&
    arg._id !== 'undefined' &&
    arg.name !== 'undefined' &&
    arg.lastName !== 'undefined' &&
    arg.email !== 'undefined' &&
    arg.username !== 'undefined' &&
    arg.password !== 'undefined' &&
    arg.createdAt !== 'undefined' &&
    arg.updatedAt !== 'undefined' &&
    arg.verifyToken !== 'undefined' &&
    arg.verified !== 'undefined'
  );
}
export function isTUserArray(arg: any): arg is TUser[] {
  return Array.isArray(arg) && arg.every((v) => isTUser(v));
}
export function asTUser(arg: any): TUser {
  if (isTUser(arg)) {
    return arg;
  }
  throw new Error('Invalid TUser');
}
