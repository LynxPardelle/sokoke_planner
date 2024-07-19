import { TUser } from '../../user/types/user.type';

export type TSesion = {
  token: string;
  isloaded: boolean;
  user: TUser | undefined;
};
