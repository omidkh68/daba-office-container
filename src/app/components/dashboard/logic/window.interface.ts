import {ServiceItemsInterface} from './service-items.interface';
import {MatDialogRef} from '@angular/material/dialog';

export interface WindowInterface {
  isActive: boolean;
  priority: number;
  windowRef: MatDialogRef<any>;
  resizable: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  maximizable: boolean;
  minimizable: boolean;
  isDraggable: boolean;
  windowService: ServiceItemsInterface;
}
