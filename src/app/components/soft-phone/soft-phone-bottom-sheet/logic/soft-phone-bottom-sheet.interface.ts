import {Type} from '@angular/core';

export interface SoftPhoneBottomSheetInterface {
  bottomSheetRef?;
  component: Type<any>;
  height: string;
  width: string;
  data?: any;
}
