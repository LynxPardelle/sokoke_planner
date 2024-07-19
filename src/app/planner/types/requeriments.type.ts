import { TStatus } from './status.type';

export type TRequeriment = {
  _id: string;
  name: string;
  description: string;
  status: TStatus;
  createdAt: Date;
  updatedAt: Date;
};
