import {ServiceItemsInterface} from './service-items.interface';
import {MatDialogRef} from '@angular/material/dialog';

export interface DialogPositionInterface {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}

export interface WindowInterface {
  windowRef: MatDialogRef<any>;
  resizable: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  maximizable: boolean;
  minimizable: boolean;
  isDraggable: boolean;
  isActive: boolean;
  // position: DialogPositionInterface;
  windowService: ServiceItemsInterface;
  priority: number;
}
