import {ServiceItemsInterface} from './service-items.interface';

export interface WindowInterface {
  windowRef: any;
  windowId: string;
  resizable: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  maximizable: boolean;
  minimizable: boolean;
  windowService: ServiceItemsInterface;
}
