import {Component, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
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
import {ButtonSheetDataService} from '../services/ButtonSheetData.service';
import {TaskEssentialInfoService} from '../../../services/taskEssentialInfo.service';

@Component({
  selector: 'app-task-current',
  templateUrl: './task-current.component.html',
  styleUrls: ['./task-current.component.scss']
})
export class TaskCurrentComponent implements OnChanges, OnDestroy {
  @Input()
  taskEssentialInfo: TaskEssentialInfo;

  @Input()
  rtlDirection = false;

  projectsList: Array<ProjectInterface> = [];
  usersList: Array<UserInterface> = [];
  user: UserContainerInterface;
  currentTasks: Array<TaskInterface> | null = null;
  message = '';
  notification = false;

  private _subscription: Subscription = new Subscription();

  constructor(private userInfoService: UserInfoService,
              private currentTaskService: CurrentTaskService,
              private buttonSheetDataService: ButtonSheetDataService,
              private taskEssentialInfoService: TaskEssentialInfoService) {
    this._subscription.add(
      this.currentTaskService.currentTask.subscribe(currentTasks => this.currentTasks = currentTasks)
    );

    this._subscription.add(
      this.userInfoService.currentUserInfo.subscribe(user => this.user = user)
    );
  }

  showTask(task: TaskInterface): void {
    this.usersList = this.taskEssentialInfoService.getUsersProjectsList.usersList;
    this.projectsList = this.taskEssentialInfoService.getUsersProjectsList.projectsList;

    setTimeout(() => {
      const data: TaskDataInterface = {
        action: 'detail',
        usersList: this.usersList,
        projectsList: this.projectsList,
        task: task,
        boardStatus: task.boardStatus
      };

      const finalData = {
        component: TaskDetailComponent,
        height: '98%',
        width: '95%',
        data: data
      };

      this.buttonSheetDataService.changeButtonSheetData(finalData);
    }, 500);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.taskEssentialInfo && !changes.taskEssentialInfo.firstChange) {
      this.usersList = changes.taskEssentialInfo.currentValue.usersList;
      this.projectsList = changes.taskEssentialInfo.currentValue.projectsList;
    }
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
