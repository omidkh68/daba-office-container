import {ServiceItemsInterface} from './service-items.interface';
import {MatDialogRef} from '@angular/material/dialog';

export interface WindowInterface {
  windowRef: MatDialogRef<any>;
  resizable: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  maximizable: boolean;
  minimizable: boolean;
  isDraggable: boolean;
  hasFrame: boolean;
  windowService: ServiceItemsInterface;
}
