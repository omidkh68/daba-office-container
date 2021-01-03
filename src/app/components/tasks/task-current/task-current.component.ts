import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
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
import {TaskEssentialInfoService} from '../../../services/taskEssentialInfo.service';
import {ButtonSheetDataService} from '../services/ButtonSheetData.service';

@Component({
  selector: 'app-task-current',
  templateUrl: './task-current.component.html',
  styleUrls: ['./task-current.component.scss']
})
export class TaskCurrentComponent implements OnChanges, OnDestroy {
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
  message: string = '';
  notification: boolean = false;

  private _subscription: Subscription = new Subscription();

  constructor(private userInfoService: UserInfoService,
              private buttonSheetDataService: ButtonSheetDataService,
              private taskEssentialInfoService: TaskEssentialInfoService,
              private currentTaskService: CurrentTaskService) {
    this._subscription.add(
      this.currentTaskService.currentTask.subscribe(currentTasks => this.currentTasks = currentTasks)
    );

    this._subscription.add(
      this.userInfoService.currentUserInfo.subscribe(user => this.user = user)
    );
  }

  showTask(task: TaskInterface) {
    /*this._subscription.add(
      this.taskEssentialInfoService.currentUsersProjectsList.subscribe((data) => {
          this.usersList = data.usersList;
          this.projectsList = data.projectsList;
        }
      )
    );*/

    this.usersList = this.taskEssentialInfoService.getUsersProjectsList.usersList;

    this.projectsList = this.taskEssentialInfoService.getUsersProjectsList.projectsList;

    setTimeout(() => {
      const data: TaskDataInterface = {
        action: 'detail',
        usersList: this.usersList,
        projectsList: this.projectsList,
        task: task,
        boardStatus: task.boardStatus,
        breadcrumbList: null
      };

      const finalData = {
        component: TaskDetailComponent,
        height: '98%',
        width: '95%',
        data: data
      };


      this.buttonSheetDataService.changeButtonSheetData(finalData);
    }, 500)


    /*const data: TaskDataInterface = {
      action: 'detail',
      usersList: this.usersList,
      projectsList: this.projectsList,
      task: task,
      boardStatus: 'inProgress'
    };

    this.triggerBottomSheet.emit({
      component: TaskDetailComponent,
      height: '98%',
      width: '95%',
      data: data
    });*/
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
