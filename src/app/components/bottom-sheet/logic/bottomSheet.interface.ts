import {Type} from '@angular/core';

export interface BottomSheetInterface {
  bottomSheetRef?;
  component: Type<any>;
  height: string;
  width: string;
  data?: any;
}
