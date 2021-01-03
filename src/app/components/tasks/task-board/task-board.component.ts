import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import * as moment from 'moment';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../logic/api.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Subscription} from 'rxjs/internal/Subscription';
import {UserInterface} from '../../users/logic/user-interface';
import {TaskInterface} from '../logic/task-interface';
import {BoardInterface, ResultInterface} from '../logic/board-interface';
import {LoginDataClass} from '../../../services/loginData.class';
import {MessageService} from '../../message/service/message.service';
import {SocketioService} from '../../../services/socketio.service';
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
import {LoadingIndicatorService} from '../../../services/loading-indicator.service';
import {TaskBottomSheetInterface} from '../task-bottom-sheet/logic/TaskBottomSheet.interface';
import {ButtonSheetDataService} from '../../../services/ButtonSheetData.service';
import {TaskEssentialInfoService} from '../../../services/taskEssentialInfo';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss']
})
export class TaskBoardComponent extends LoginDataClass implements OnInit, OnDestroy, OnChanges {
  @Output()
  triggerBottomSheet: EventEmitter<TaskBottomSheetInterface> = new EventEmitter<TaskBottomSheetInterface>();

  @Output()
  pushTaskEssentialInfo = new EventEmitter();

  @Input()
  pushTaskToBoard;

  @Input()
  rtlDirection: boolean;

  @Input()
  refreshData: boolean = false;

  @Input()
  filterBoards: any;

  // socket;
  myTasks: Array<TaskInterface> = [];
  rowHeight: string = '0';
  connectedTo = [];
  boards: BoardInterface[] = [];
  usersList: UserInterface[] = [];
  projectsList: ProjectInterface[] = [];
  currentTasks: Array<TaskInterface> | null = null;

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private api: ApiService,
              private injector: Injector,
              private socketService: SocketioService,
              private messageService: MessageService,
              private userInfoService: UserInfoService,
              private currentTaskService: CurrentTaskService,
              private refreshLoginService: RefreshLoginService,
              private refreshBoardService: RefreshBoardService,
              private windowManagerService: WindowManagerService,
              private buttonSheetDataService: ButtonSheetDataService,
              private taskEssentialInfoService: TaskEssentialInfoService,
              private loadingIndicatorService: LoadingIndicatorService) {
    super(injector, userInfoService);

    this._subscription.add(
      this.currentTaskService.currentTask.subscribe(currentTasks => this.currentTasks = currentTasks)
    );

    this._subscription.add(
      this.refreshBoardService.currentDoRefresh.subscribe(doRefresh => {
        if (doRefresh) {
          this.getBoards();
        }
      })
    );

    this._subscription.add(
      this.userInfoService.currentLoginData.subscribe(() => this.getBoards())
    );
  }

  ngOnInit(): void {
    this.rowHeight = '100%';
  }

  changeStatus(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'project'});

      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);

      let taskData = event.item.data;

      this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

      this._subscription.add(
        this.api.taskChangeStatus(taskData, event.container.id).subscribe(async (resp: any) => {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

          if (resp.result) {
            const newTask = resp.content;

            this.messageService.showMessage(resp.message);

            this.assignNewTaskToBoard(newTask, event.previousContainer.id, event.container.id);
          }
        }, (error: HttpErrorResponse) => {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

          this.refreshLoginService.openLoginDialog(error);
        })
      );
    }
  }

  async assignNewTaskToBoard(newTask: TaskInterface, prevContainer, newContainer) {
    const project: ProjectInterface = await this.projectsList.filter(project => project.projectId === newTask.project.projectId).pop();
    const assignTo: UserInterface = await this.usersList.filter(user => user.adminId === newTask.assignTo.adminId).pop();

    this.myTasks = [];

    await this.boards.map((board: BoardInterface) => {
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
  }

  showTaskStopModal(task) {
    const dialogRef = this.dialog.open(TaskStopComponent, {
      data: task,
      autoFocus: false,
      width: '500px',
      height: '310px',
      disableClose: true
    });

    this.windowManagerService.dialogOnTop(dialogRef.id);

    this._subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getBoards();
        }
      })
    );
  }

  showTaskDetail(task, boardStatus) {
    /*this.triggerBottomSheet.emit({
          component: TaskDetailComponent,
          height: '98%',
          width: '95%',
          data: data
        });*/

    const data: TaskDataInterface = {
      action: 'detail',
      usersList: this.usersList,
      projectsList: this.projectsList,
      task: task,
      boardStatus: boardStatus,
      boardsList: this.boards
    };

    const finalData = {
      component: TaskDetailComponent,
      height: '98%',
      width: '95%',
      data: data
    };

    this.buttonSheetDataService.changeButtonSheetData(finalData);
  }

  putTasksToAllBoards(info) {
    let todo_tasks: TaskInterface[] = [];
    let inProgress_tasks: TaskInterface[] = [];
    let done_tasks: TaskInterface[] = [];

    this.boards = [];
    this.connectedTo = [];

    this.usersList = info.content.users.list;
    this.projectsList = info.content.projects.list;

    this.pushTaskEssentialInfo.emit({usersList: this.usersList, projectsList: this.projectsList});

    this.myTasks = [];

    info.content.boards.list.map((task: TaskInterface) => {
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
      tasks: todo_tasks
    });

    this.boards.push({
      id: 'inProgress',
      cols: 1,
      rows: 1,
      name: 'tasks.boards.in_progress',
      tasks: inProgress_tasks
    });

    this.boards.push({
      id: 'done',
      cols: 1,
      rows: 1,
      name: 'tasks.boards.done',
      tasks: done_tasks
    });

    for (let board of this.boards) {
      this.connectedTo.push(board.id);
    }

    this.currentTaskService.changeCurrentTask(this.myTasks);

    this.myTasks = [];
  }

  getBoards() {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'project'});

    if (this.loginData && this.loginData.token_type) {
      this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

      this._subscription.add(
        this.api.boards(this.loggedInUser.email).subscribe((resp: ResultInterface) => {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

          if (resp.result === 1) {

            const data = {
              'usersList': resp.content.users.list,
              'projectsList': resp.content.projects.list
            };

            this.taskEssentialInfoService.changeUsersProjectsList(data)

            this.putTasksToAllBoards(resp);
          }
        }, (error: HttpErrorResponse) => {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

          this.refreshLoginService.openLoginDialog(error);
        })
      );
    }
  }

  getColor(percentage: number) {
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

  ngOnChanges(changes: SimpleChanges): void {
    if (this.refreshData) {
      this.getBoards();
    }

    if (changes.filterBoards && !changes.filterBoards.firstChange) {
      this.filterBoards = changes.filterBoards.currentValue;

      this.putTasksToAllBoards(this.filterBoards.resp);
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
  }
}
