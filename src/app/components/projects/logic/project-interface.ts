import {UserInterface} from '../../users/logic/user-interface';

export interface ProjectInterface {
  projectId: number;
  projectName: string;
  projectTime?: number;
  startAt?: string;
  stopAt?: string;
  actualStart?: string;
  actualStop?: string;
  description?: string;
  projectStatus?: string;
  projectActiveStatus?: number;
  userCreator?: UserInterface;
  creationDate?: string;
  deletedStatus?: number;
}
