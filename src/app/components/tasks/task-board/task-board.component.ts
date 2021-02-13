import {
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Pipe,
  PipeTransform,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import {timer} from 'rxjs';
import * as moment from 'moment';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../logic/api.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Subscription} from 'rxjs/internal/Subscription';
import {UserInterface} from '../../users/logic/user-interface';
import {TaskInterface} from '../logic/task-interface';
import {
  BoardInterface,
  ResultFilterInterface,
  ResultInterface,
  ResultTaskInterface,
  UsersProjectsListInterface
} from '../logic/board-interface';
import {LoginDataClass} from '../../../services/loginData.class';
import {MessageService} from '../../message/service/message.service';
import {UserInfoService} from '../../users/services/user-info.service';
import {ProjectInterface} from '../../projects/logic/project-interface';
import {HttpErrorResponse} from '@angular/common/http';
import {TaskDataInterface} from '../logic/task-data-interface';
import {TaskStopComponent} from '../task-stop/task-stop.component';
import {CurrentTaskService} from '../services/current-task.service';
import {TaskDetailComponent} from '../task-detail/task-detail.component';
import {RefreshBoardService} from '../services/refresh-board.service';
import {RefreshLoginService} from '../../login/services/refresh-login.service';
import {WindowManagerService} from '../../../services/window-manager.service';
import {BottomSheetDataService} from '../services/BottomSheetData.service';
import {LoadingIndicatorService} from '../../../services/loading-indicator.service';
import {TaskEssentialInfoService} from '../../../services/taskEssentialInfo.service';
import {TaskBottomSheetInterface} from '../task-bottom-sheet/logic/TaskBottomSheet.interface';
import {TaskBottomSheetComponent} from '../task-bottom-sheet/task-bottom-sheet.component';
import {IgnoreAutoRefreshService} from '../services/ignore-auto-refresh.service';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss']
})
export class TaskBoardComponent extends LoginDataClass implements OnInit, OnDestroy, OnChanges {
  @ViewChildren('searchBox') searchBoxes: QueryList<ElementRef>;

  @Output()
  pushTaskEssentialInfo = new EventEmitter<UsersProjectsListInterface>();

  @Output()
  resetFilter: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  pushTaskToBoard;

  @Input()
  rtlDirection = false;

  @Input()
  refreshData = false;

  @Input()
  filterBoards: any;

  @Input()
  bottomSheetRef: TaskBottomSheetComponent;

  myTasks: Array<TaskInterface> = [];
  rowHeight = '0';
  connectedTo = [];
  boards: Array<BoardInterface> = [];
  usersList: Array<UserInterface> = [];
  projectsList: Array<ProjectInterface> = [];
  currentTasks: Array<TaskInterface> | null = null;
  filterArgs = null;
  showFilterArgs = null;

  timerDueTime = 0;
  timerPeriod = 2 * 60 * 1000; // refresh board every two minutes
  globalTimer = null;
  globalTimerSubscription: Subscription;

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private injector: Injector,
              private apiService: ApiService,
              private messageService: MessageService,
              private userInfoService: UserInfoService,
              private currentTaskService: CurrentTaskService,
              private refreshLoginService: RefreshLoginService,
              private refreshBoardService: RefreshBoardService,
              private windowManagerService: WindowManagerService,
              private bottomSheetDataService: BottomSheetDataService,
              private loadingIndicatorService: LoadingIndicatorService,
              private taskEssentialInfoService: TaskEssentialInfoService,
              private ignoreAutoRefreshService: IgnoreAutoRefreshService) {
    super(injector, userInfoService);

    this._subscription.add(
      this.currentTaskService.currentTask.subscribe(currentTasks => this.currentTasks = currentTasks)
    );

    this._subscription.add(
      this.refreshBoardService.currentDoRefresh.subscribe(doRefresh => {
        if (doRefresh) {
          this.doResetFilter();

          this.clearTimer();

          setTimeout(() => this.startTimer(), 200);
        }
      })
    );

    this._subscription.add(
      this.userInfoService.currentLoginData.subscribe(() => {
        this.doResetFilter();

        this.clearTimer();

        setTimeout(() => this.startTimer(), 200);
      })
    );

    this._subscription.add(
      this.ignoreAutoRefreshService.currentAutoRefresh.subscribe((status: boolean) => {
        if (status) {
          this.clearTimer();
        } else {
          this.clearTimer();

          setTimeout(() => this.startTimer(), 200);
        }
      })
    );
  }

  ngOnInit(): void {
    this.rowHeight = '100%';

    this.resetColumnFilter();
  }

  resetColumnFilter(): void {
    this.filterArgs = {
      todo: null,
      inProgress: null,
      done: null
    };

    this.showFilterArgs = {
      todo: false,
      inProgress: false,
      done: false
    };
  }

  changeStatus(event: CdkDragDrop<Array<TaskInterface>>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'project'});

      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

      const taskData = event.item.data;

      this.apiService.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

      this._subscription.add(
        this.apiService.taskChangeStatus(taskData, event.container.id).subscribe((resp: ResultTaskInterface) => {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

          if (resp.result) {
            const newTask = resp.content;

            this.assignNewTaskToBoard(newTask, event.previousContainer.id, event.container.id);
          }

          if (resp.message) {
            this.messageService.showMessage(resp.message);
          }
        }, (error: HttpErrorResponse) => {
          if (error.message) {
            this.messageService.showMessage(error.message, 'error');
          }

          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

          this.refreshLoginService.openLoginDialog(error);
        })
      );
    }
  }

  assignNewTaskToBoard(newTask: TaskInterface, prevContainer: string, newContainer: string): void {
    const project: ProjectInterface = this.projectsList.filter(project => project.projectId === newTask.project.projectId).pop();
    const assignTo: UserInterface = this.usersList.filter(user => user.adminId === newTask.assignTo.adminId).pop();

    this.myTasks = [];

    this.boards.map((board: BoardInterface) => {
      if (board.id === newContainer) {
        board.tasks.map((task: TaskInterface) => {
          if (task.taskId === newTask.taskId) {
            newTask.assignTo = assignTo;
            newTask.project = project;

            task = Object.assign(task, newTask);
          }

          if (task.assignTo.email === this.loggedInUser.email && newContainer === 'inProgress') {
            this.myTasks.push(task);
          }

          return task;
        });
      }
    });

    if (this.myTasks.length) {
      this.currentTaskService.changeCurrentTask(this.myTasks);
      this.myTasks = [];
    } else {
      if (!this.currentTasks.length) {
        this.currentTaskService.changeCurrentTask(null);
      } else {
        if (newTask.boardStatus !== 'inProgress') {
          const findIndex = this.currentTasks.findIndex(task => task.taskId === newTask.taskId);

          this.currentTasks.splice(findIndex, 1);

          this.currentTaskService.changeCurrentTask(this.currentTasks);
        }
      }
    }

    if (prevContainer === 'inProgress' && (newContainer === 'todo' || newContainer === 'done')) {
      this.showTaskStopModal(newTask);
    } else if (prevContainer === 'todo' && newContainer === 'done') {
      this.showTaskStopModal(newTask);
    } else if (prevContainer === 'done' && newContainer === 'todo') {
      const editedTask: TaskInterface = {...newTask, percentage: 0, boardStatus: 'todo'};
      this.showTaskStopModal(editedTask);
    }

    this.resetColumnFilter();
  }

  showTaskStopModal(task: TaskInterface): void {
    const dialogRef = this.dialog.open(TaskStopComponent, {
      data: task,
      autoFocus: false,
      width: '500px',
      height: '310px',
      disableClose: true
    });

    this._subscription.add(
      dialogRef.afterOpened().subscribe(() => {
        this.windowManagerService.dialogOnTop(dialogRef.id);
      })
    );

    this._subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getBoards();

          this.doResetFilter();
        }
      })
    );
  }

  showTaskDetail(task: TaskInterface, boardStatus: string): void {
    const data: TaskDataInterface = {
      action: 'detail',
      usersList: this.usersList,
      projectsList: this.projectsList,
      task: task,
      boardStatus: boardStatus,
      boardsList: this.boards
    };

    const finalData: TaskBottomSheetInterface = {
      bottomSheetRef: this.bottomSheetRef,
      component: TaskDetailComponent,
      height: '98%',
      width: '95%',
      data: data
    };

    this.clearTimer();

    this.bottomSheetDataService.changeButtonSheetData(finalData);
  }

  putTasksToAllBoards(info: ResultFilterInterface | ResultInterface): void {
    const todo_tasks: Array<TaskInterface> = [];
    const inProgress_tasks: Array<TaskInterface> = [];
    const done_tasks: Array<TaskInterface> = [];

    this.boards = [];
    this.connectedTo = [];

    this.usersList = info.contents.users.list;
    this.projectsList = info.contents.projects.list;

    this.pushTaskEssentialInfo.emit({usersList: this.usersList, projectsList: this.projectsList});

    this.myTasks = [];

    info.contents.boards.list.map((task: TaskInterface) => {
      // collect all logged in user`s task into myTasks
      if (task.assignTo.email === this.loggedInUser.email && task.boardStatus === 'inProgress') {
        this.myTasks.push(task);
      }

      const taskStopDate = task.stopAt;
      const localDate = new Date();

      const localDateTmp = moment(localDate).format('YYYY-MM-DD HH:mm:ss');

      const m = moment.utc(taskStopDate, 'YYYY-MM-DD HH:mm:ss');
      const isSameOrBefore = m.isSameOrBefore(localDateTmp);

      // determine todoList, inProgressList, doneList into board array
      switch (task.boardStatus) {
        case 'todo':
          task.overdue = isSameOrBefore;
          todo_tasks.push(task);
          break;

        case 'inProgress':
          task.overdue = isSameOrBefore;
          inProgress_tasks.push(task);
          break;

        case 'done':
          done_tasks.push(task);
          break;
      }
    });

    this.boards.push({
      id: 'todo',
      cols: 1,
      rows: 1,
      name: 'tasks.boards.todo',
      icon: 'add_task',
      tasks: todo_tasks
    });

    this.boards.push({
      id: 'inProgress',
      cols: 1,
      rows: 1,
      name: 'tasks.boards.in_progress',
      icon: 'playlist_play',
      tasks: inProgress_tasks
    });

    this.boards.push({
      id: 'done',
      cols: 1,
      rows: 1,
      name: 'tasks.boards.done',
      icon: 'done_all',
      tasks: done_tasks
    });

    for (const board of this.boards) {
      this.connectedTo.push(board.id);
    }

    this.currentTaskService.changeCurrentTask(this.myTasks);

    this.myTasks = [];

    this.resetColumnFilter();
  }

  getBoards(): void {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'project'});

    if (this.loginData && this.loginData.token_type) {
      this.apiService.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

      this._subscription.add(
        this.apiService.boards(this.loggedInUser.email).subscribe((resp: ResultInterface) => {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

          if (resp.result === 1) {

            const data = {
              'usersList': resp.contents.users.list,
              'projectsList': resp.contents.projects.list
            };

            this.taskEssentialInfoService.changeUsersProjectsList(data);

            this.putTasksToAllBoards(resp);

            this.resetColumnFilter();
          }
        }, (error: HttpErrorResponse) => {
          if (error.message) {
            this.messageService.showMessage(error.message, 'error');
          }

          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

          this.refreshLoginService.openLoginDialog(error);
        })
      );
    }
  }

  getColor(percentage: number): string {
    if (percentage < 10 && percentage >= 0) {
      return 'spinner-color-red';
    } else if (percentage <= 30 && percentage > 10) {
      return 'spinner-color-redorange';
    } else if (percentage <= 50 && percentage > 30) {
      return 'spinner-color-orange';
    } else if (percentage <= 80 && percentage > 50) {
      return 'spinner-color-lightgreen';
    } else if (percentage > 80) {
      return 'spinner-color-green';
    }
  }

  doResetFilter(): void {
    this.resetFilter.emit(true);
  }

  focusSearchBox(boardId: string): void {
    this.searchBoxes.toArray().map((searchBox: ElementRef) => {
      const el = searchBox.nativeElement;

      if (el.getAttribute('aria-label') === boardId) {
        setTimeout(() => el.focus(), 0);
      }
    });
  }

  startTimer(): void {
    if (this.globalTimer) {
      this.globalTimer = null;
    }

    this.globalTimer = timer(
      this.timerDueTime, this.timerPeriod
    );

    if (this.globalTimerSubscription) {
      this.globalTimerSubscription.unsubscribe();
    }

    this.globalTimerSubscription = this.globalTimer.subscribe(() => {
      if (this.globalTimer) {
        this.getBoards();
      }
    });
  }

  clearTimer(): void {
    if (this.globalTimerSubscription) {
      this.globalTimerSubscription.unsubscribe();
      this.globalTimer = null;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.refreshData) {
      // this.getBoards();

      this.doResetFilter();

      this.clearTimer();

      setTimeout(() => this.startTimer(), 200);
    }

    if (changes.filterBoards && !changes.filterBoards.firstChange) {
      this.filterBoards = changes.filterBoards.currentValue;

      this.putTasksToAllBoards(this.filterBoards.resp);

      this.clearTimer();
    }

    if (changes.pushTaskToBoard && !changes.pushTaskToBoard.firstChange) {
      this.pushTaskToBoard = changes.pushTaskToBoard.currentValue;

      this.assignNewTaskToBoard(this.pushTaskToBoard.task, this.pushTaskToBoard.prevContainer, this.pushTaskToBoard.newContainer);
    }
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }

    this.clearTimer();
  }
}

@Pipe({
  name: 'myFilter',
  pure: false
})
export class MyFilterPipe implements PipeTransform {
  transform(items: Array<TaskInterface>, filter: string): Array<TaskInterface> {
    if (!items || !filter) {
      return items;
    }

    return items.filter((task: TaskInterface) => {
      if (task.taskName.toLowerCase().includes(filter.toLowerCase())) {
        return task;
      }

      if (task.project.projectName.toLowerCase().includes(filter.toLowerCase())) {
        return task;
      }

      if (task.assigner.toLowerCase().includes(filter.toLowerCase())) {
        return task;
      }

      if (task.assignTo.name.toLowerCase().includes(filter.toLowerCase())) {
        return task;
      }

      if (task.assignTo.family.toLowerCase().includes(filter.toLowerCase())) {
        return task;
      }

      if (task.assignTo.email.toLowerCase().includes(filter.toLowerCase())) {
        return task;
      }
    });
  }
}
