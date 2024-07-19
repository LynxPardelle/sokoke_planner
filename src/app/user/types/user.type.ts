import { TProject } from '../../planner/types/project.type';
import { TProjectCategory } from '../../planner/types/projectCategory.type';

export type TUser = {
  _id: string;
  email: string;
  password: string;
  username: string;
  projects: TProject[];
  categories: TProjectCategory[];
};
