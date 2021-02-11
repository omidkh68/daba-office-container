import {MatDialogRef} from '@angular/material/dialog';
import {ServiceInterface} from '../../services/logic/service-interface';

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
  windowService: ServiceInterface;
}
