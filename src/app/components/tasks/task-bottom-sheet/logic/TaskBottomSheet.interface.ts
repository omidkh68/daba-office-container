import {Type} from '@angular/core';
import {TaskDataInterface} from '../../logic/task-data-interface';

export interface TaskBottomSheetInterface {
  bottomSheetRef?;
  component: Type<any>;
  height: string;
  width: string;
  data?: TaskDataInterface;
}
