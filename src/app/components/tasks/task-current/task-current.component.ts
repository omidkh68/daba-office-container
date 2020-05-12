import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {TaskInterface} from '../logic/task-interface';
import {ElectronService} from '../../../core/services';
import {CurrentTaskService} from '../../../services/current-task.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {TaskFilesComponent} from '../task-files/task-files.component';

@Component({
  selector: 'app-task-current',
  templateUrl: './task-current.component.html',
  styleUrls: ['./task-current.component.scss']
})
export class TaskCurrentComponent implements OnInit {
  currentTasks: Array<TaskInterface> | null = null;
  version;
  message: string = '';
  notification: boolean = false;
  restartBtn: boolean = false;

  private _subscription: Subscription = new Subscription();

  constructor(private electronService: ElectronService,
              private currentTaskService: CurrentTaskService,
              private _bottomSheet: MatBottomSheet) {
    this._subscription.add(
      this.currentTaskService.currentTask.subscribe(currentTasks => this.currentTasks = currentTasks)
    );
  }

  ngOnInit(): void {
    this.electronService.ipcRenderer.send('app_version');

    this.electronService.ipcRenderer.on('app_version', (event, arg) => {
      this.electronService.ipcRenderer.removeAllListeners('app_version');

      this.version = arg.version;
    });

    this.electronService.ipcRenderer.on('update_available', () => {
      this.electronService.ipcRenderer.removeAllListeners('update_available');
      this.message = 'A new update is available. Downloading now...';
      this.notification = true;
    });

    this.electronService.ipcRenderer.on('update_downloaded', () => {
      this.electronService.ipcRenderer.removeAllListeners('update_downloaded');
      this.message = 'Update Downloaded. It will be installed on restart. Restart Now?';
      this.restartBtn = true;
      this.notification = true;
    });
  }

  showTask(task: TaskInterface) {
    this._bottomSheet.open(TaskFilesComponent, {
      data: task,

    });
  }

  closeNotification() {
    this.notification = false;
  }

  restartApp() {
    this.electronService.ipcRenderer.send('restart_app');
  }

}
