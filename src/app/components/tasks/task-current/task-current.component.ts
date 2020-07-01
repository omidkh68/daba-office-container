import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {TaskInterface} from '../logic/task-interface';
import {UserInterface} from '../../users/logic/user-interface';
import {UserInfoService} from '../../users/services/user-info.service';
import {ProjectInterface} from '../../projects/logic/project-interface';
import {TaskEssentialInfo} from '../task-main/task-main.component';
import {TaskDataInterface} from '../logic/task-data-interface';
import {CurrentTaskService} from '../services/current-task.service';
import {TaskDetailComponent} from '../task-detail/task-detail.component';
import {UserContainerInterface} from '../../users/logic/user-container.interface';
import {TaskBottomSheetInterface} from '../task-bottom-sheet/logic/TaskBottomSheet.interface';

@Component({
  selector: 'app-task-current',
  templateUrl: './task-current.component.html',
  styleUrls: ['./task-current.component.scss']
})
export class TaskCurrentComponent implements OnInit, OnChanges, OnDestroy {
  @Output()
  triggerBottomSheet: EventEmitter<TaskBottomSheetInterface> = new EventEmitter<TaskBottomSheetInterface>();

  @Output()
  pushTaskToBoard = new EventEmitter();

  @Input()
  taskEssentialInfo: TaskEssentialInfo;

  @Input()
  rtlDirection: boolean;

  projectsList: ProjectInterface[] = [];
  usersList: UserInterface[] = [];
  user: UserContainerInterface;
  currentTasks: Array<TaskInterface> | null = null;
  version;
  message: string = '';
  notification: boolean = false;

  private _subscription: Subscription = new Subscription();

  constructor(// private electronService: ElectronService,
              private currentTaskService: CurrentTaskService,
              private userInfoService: UserInfoService) {
    this._subscription.add(
      this.currentTaskService.currentTask.subscribe(currentTasks => this.currentTasks = currentTasks)
    );

    this._subscription.add(
      this.userInfoService.currentUserInfo.subscribe(user => this.user = user)
    );
  }

  ngOnInit(): void {
    /*this.electronService.ipcRenderer.send('app_version');

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
    });*/
  }

  showTask(task: TaskInterface) {
    const data: TaskDataInterface = {
      action: 'detail',
      usersList: this.usersList,
      projectsList: this.projectsList,
      task: task,
      boardStatus: 'inProgress'
    };

    /*const bottomSheetRef = this.bottomSheet.open(TaskDetailComponent, {
      data: data,
      autoFocus: false
    });

    this._subscription.add(
      bottomSheetRef.afterDismissed().subscribe(result => {
        if (result !== undefined && result !== false) {
          this.assignNewTaskToBoard(result.task, result.prevContainer, result.newContainer);

          // this.socket.emit('updatedata');
        }
      })
    );*/

    this.triggerBottomSheet.emit({
      component: TaskDetailComponent,
      height: '98%',
      width: '95%',
      data: data
    });
  }

  currentTaskPushToBoard(task: TaskInterface, prevContainer, newContainer) {
    this.pushTaskToBoard.emit({task: task, prevContainer: prevContainer, newContainer: newContainer});
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.taskEssentialInfo && !changes.taskEssentialInfo.firstChange) {
      this.usersList = changes.taskEssentialInfo.currentValue.usersList;
      this.projectsList = changes.taskEssentialInfo.currentValue.projectsList;
    }
  }

  /*closeNotification() {
    this.notification = false;
  }*/

  /*restartApp() {
    this.electronService.ipcRenderer.send('restart_app');
  }*/

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
