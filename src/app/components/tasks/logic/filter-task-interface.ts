import {FilterInterface} from './filter-interface';
import {UserInterface} from '../../users/logic/user-interface';
import {ProjectInterface} from '../../projects/logic/project-interface';

export interface FilterTaskInterface {
  filterData: FilterInterface;
  usersList: UserInterface[];
  projectsList: ProjectInterface[];
}
