import {TaskInterface} from './task-interface';

export interface BoardInterface {
  id: string;
  name: string;
  cols: number;
  rows: number;
  tasks: TaskInterface[];
}
