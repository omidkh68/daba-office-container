import {EventHandlerInterface} from './event-handler.interface';
import {Type} from '@angular/core';

export interface EventHandlerDataInterface {
  action?: string;
  eventItems?: EventHandlerInterface;
  currentDate?: Date,
  events: Array<EventHandlerInterface>
}

export interface EventHandlerBottomSheetInterface {
  bottomSheetRef?;
  component: Type<any>;
  height: string;
  width: string;
  data?: EventHandlerDataInterface;
}
