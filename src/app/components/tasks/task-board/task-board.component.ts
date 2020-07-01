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
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../logic/api.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Subscription} from 'rxjs/internal/Subscription';
import {UserInterface} from '../../users/logic/user-interface';
import {TaskInterface} from '../logic/task-interface';
import {BoardInterface} from '../logic/board-interface';
import {LoginDataClass} from '../../../services/loginData.class';
import {SocketioService} from '../../../services/socketio.service';
import {UserInfoService} from '../../users/services/user-info.service';
import {ProjectInterface} from '../../projects/logic/project-interface';
import {TranslateService} from '@ngx-translate/core';
import {TaskDataInterface} from '../logic/task-data-interface';
import {TaskStopComponent} from '../task-stop/task-stop.component';
import {CurrentTaskService} from '../services/current-task.service';
import {TaskDetailComponent} from '../task-detail/task-detail.component';
import {RefreshBoardService} from '../services/refresh-board.service';
import {LoadingIndicatorService} from '../../../services/loading-indicator.service';
import {TaskBottomSheetInterface} from '../task-bottom-sheet/logic/TaskBottomSheet.interface';

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

  constructor(private api: ApiService,
              private userInfoService: UserInfoService,
              private socketService: SocketioService,
              private injector: Injector,
              private currentTaskService: CurrentTaskService,
              private loadingIndicatorService: LoadingIndicatorService,
              public dialog: MatDialog,
              private translate: TranslateService,
              private refreshBoardService: RefreshBoardService) {
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
  }

  ngOnInit(): void {
    this.rowHeight = '100%';

    this.getBoards();

    /*this.socket.on('update-data', (data: any) => {
      this.getBoards();
    });*/

    // this.setupSocket();
  }

  /*setupSocket() {
    this.socket = this.socketService.setupSocketConnection('boards');
    this.socket.emit('getBoards');
    this.socket.on('getBoards', data => {
      console.log(data);
    });
  }*/

  drop(event: CdkDragDrop<string[]>) {
    this.loadingIndicatorService.changeLoadingStatus(true);

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);

      let taskData = event.item.data;

      this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

      this._subscription.add(
        this.api.taskChangeStatus(taskData, event.container.id).subscribe(async (resp: any) => {
          this.loadingIndicatorService.changeLoadingStatus(false);

          if (resp.result) {
            const newTask = resp.content.task;

            this.assignNewTaskToBoard(newTask, event.previousContainer.id, event.container.id);
          }
        }, error => {
          this.loadingIndicatorService.changeLoadingStatus(false);
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

          if (task.assignTo.email === this.loggedInUser.email && task.boardStatus === 'inProgress') {
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
      this.currentTaskService.changeCurrentTask(null);
    }

    if (prevContainer === 'inProgress' && (newContainer === 'todo' || newContainer === 'done')) {
      this.showTaskStopModal(newTask);
    } else if (prevContainer === 'todo' && newContainer === 'done') {
      this.showTaskStopModal(newTask);
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

    this._subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // this.socket.emit('updatedata', result);
        }
      })
    );
  }

  showTaskDetail(task, boardStatus) {
    const data: TaskDataInterface = {
      action: 'detail',
      usersList: this.usersList,
      projectsList: this.projectsList,
      task: task,
      boardStatus: boardStatus
    };

    this.triggerBottomSheet.emit({
      component: TaskDetailComponent,
      height: '98%',
      width: '95%',
      data: data
    });
  }

  getBoards() {
    this.loadingIndicatorService.changeLoadingStatus(true);

    if (this.loggedInUser && this.loggedInUser.email) {
      this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

      this._subscription.add(
        this.api.boards(this.loggedInUser.email).subscribe((resp: any) => {
          this.loadingIndicatorService.changeLoadingStatus(false);

          if (resp.result === 1) {
            this.putTasksToAllBoards(resp);
          }
        }, error => {
          this.loadingIndicatorService.changeLoadingStatus(false);
        })
      );
    }
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

      // determine todoList, inProgressList, doneList into board array
      switch (task.boardStatus) {
        case 'todo':
          todo_tasks.push(task);
          break;

        case 'inProgress':
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
      name: this.getTranslate('tasks.boards.todo'),
      tasks: todo_tasks
    });

    this.boards.push({
      id: 'inProgress',
      cols: 1,
      rows: 1,
      name: this.getTranslate('tasks.boards.in_progress'),
      tasks: inProgress_tasks
    });

    this.boards.push({
      id: 'done',
      cols: 1,
      rows: 1,
      name: this.getTranslate('tasks.boards.done'),
      tasks: done_tasks
    });

    for (let board of this.boards) {
      this.connectedTo.push(board.id);
    }

    this.currentTaskService.changeCurrentTask(this.myTasks);

    this.myTasks = [];
  }

  getColor(percentage: number) {
    if (percentage < 10 && percentage >= 0) {
      return 'spinner-color-red';
    } else if (percentage < 30 && percentage > 10) {
      return 'spinner-color-redorange';
    } else if (percentage < 50 && percentage > 30) {
      return 'spinner-color-orange';
    } else if (percentage < 80 && percentage > 50) {
      return 'spinner-color-lightgreen';
    } else if (percentage > 80) {
      return 'spinner-color-green';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.refreshData) {
      // this.socket.emit('updatedata');
      this.getBoards();
    }

    if (changes.filterBoards && !changes.filterBoards.firstChange) {
      this.filterBoards = changes.filterBoards.currentValue;

      this.putTasksToAllBoards(this.filterBoards.resp);
    }

    if (changes.pushTaskToBoard && !changes.pushTaskToBoard.firstChange) {
      this.pushTaskToBoard = changes.pushTaskToBoard.currentValue;

      this.assignNewTaskToBoard(this.pushTaskToBoard.task, this.pushTaskToBoard.prevContainer, this.pushTaskToBoard.newContainer);

      // this.socket.emit('updatedata');
    }
  }

  getTranslate(word) {
    return this.translate.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
