import { TProject } from '../../planner/types/project.type';
import { TProjectCategory } from '../../planner/types/projectCategory.type';

export type TUser = {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  projects: TProject[];
  categories: TProjectCategory[];
};
