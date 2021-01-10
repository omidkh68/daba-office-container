import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../logic/api.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs/internal/Subscription';
import {TaskInterface} from '../logic/task-interface';
import {LoginInterface} from '../../login/logic/login.interface';
import {MessageService} from '../../message/service/message.service';
import {ApproveComponent} from '../../approve/approve.component';
import {TranslateService} from '@ngx-translate/core';
import {ProjectInterface} from '../../projects/logic/project-interface';
import {HttpErrorResponse} from '@angular/common/http';
import {TaskDataInterface} from '../logic/task-data-interface';
import {TaskDetailComponent} from '../task-detail/task-detail.component';
import {RefreshBoardService} from '../services/refresh-board.service';
import {RefreshLoginService} from '../../login/services/refresh-login.service';
import {WindowManagerService} from '../../../services/window-manager.service';
import {UserContainerInterface} from '../../users/logic/user-container.interface';
import {ButtonSheetDataService} from '../services/ButtonSheetData.service';
import {TaskEssentialInfoService} from '../../../services/taskEssentialInfo.service';
import {TaskBottomSheetInterface} from '../task-bottom-sheet/logic/TaskBottomSheet.interface';
import {ResultInterface, ResultTaskInterface} from '../logic/board-interface';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../services/loading-indicator.service';

@Component({
  selector: 'app-task-todo',
  templateUrl: './task-todo.component.html',
  styleUrls: ['./task-todo.component.scss']
})
export class TaskTodoComponent implements OnInit, OnDestroy {
  @Input()
  taskId: number = 0;

  @Input()
  parentTaskData: TaskInterface;

  @Input()
  rtlDirection: boolean;

  @Input()
  loginData: LoginInterface;

  @Input()
  loggedInUser: UserContainerInterface;

  form: FormGroup;
  edit: boolean = false;
  user: UserContainerInterface;
  loadingIndicator: LoadingIndicatorInterface = {status: false, serviceName: 'todo'};
  tasks: TaskInterface[] = [];
  bottomSheetData = null;
  usersList: any = [];
  projectsList: any = [];
  breadcrumbList: ProjectInterface[] = [];

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private fb: FormBuilder,
              private api: ApiService,
              private messageService: MessageService,
              private translateService: TranslateService,
              private refreshLoginService: RefreshLoginService,
              private refreshBoardService: RefreshBoardService,
              private windowManagerService: WindowManagerService,
              private buttonSheetDataService: ButtonSheetDataService,
              private taskEssentialInfoService: TaskEssentialInfoService,
              private loadingIndicatorService: LoadingIndicatorService) {
    this._subscription.add(
      this.loadingIndicatorService.currentLoadingStatus.subscribe(status => this.loadingIndicator = status)
    );
  }

  ngOnInit() {
    this._subscription.add(
      this.buttonSheetDataService.currentButtonSheetData.subscribe((data: TaskBottomSheetInterface) => {
          this.bottomSheetData = Object.assign({}, this.bottomSheetData, data);
        }
      )
    );

    this.createForm();

    this.getTaskList();
  }

  createForm() {
    this.form = this.fb.group({
      taskId: new FormControl(0),
      status: new FormControl(1),
      taskName: new FormControl(''),
      percentage: new FormControl(0),
      assignTo: new FormControl(''),
      taskDurationHours: new FormControl(0),
      taskDurationMinutes: new FormControl(0),
      startAt: new FormControl(''),
      stopAt: new FormControl(''),
      startTime: new FormControl(''),
      stopTime: new FormControl(''),
      project: new FormControl({}),
      taskDesc: new FormControl(''),
      email: new FormControl('0'),
      boardStatus: new FormControl(''),
      taskDateStart: '0000-00-00 00:00:00',
      taskDateStop: '0000-00-00 00:00:00',
      assigner: new FormControl(this.loggedInUser.email),
      trackable: new FormControl(0),
      parentTaskId: new FormControl(0),
    });
  }

  changeTodo(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {

      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      this.changeTodoPriority(event.container.data);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  changeTodoPriority(todoList) {
    let tempTodoList = todoList;

    tempTodoList.map((todo, i) => {

      return todo.priority = i;
    });

    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'todo'});

    this.form.disable();

    this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    this._subscription.add(
      this.api.changePriority(tempTodoList).subscribe((resp: any) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'todo'});

        this.form.enable();

        this.messageService.showMessage(resp.message);
      }, (error: HttpErrorResponse) => {
        if (error.message) {
          this.messageService.showMessage(error.message);
        }

        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'todo'});

        this.refreshLoginService.openLoginDialog(error);
      })
    );
  }

  sortTodo() {
    this.tasks.sort((first, second) => {
      const a = first.priority;
      const b = second.priority;

      let comparison = 0;
      if (a > b) {
        comparison = 1;
      } else if (a < b) {
        comparison = -1;
      }
      return comparison;
    });
  }

  getTaskList() {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'todo'});

    this.form.disable();

    this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    this.usersList = this.taskEssentialInfoService.getUsersProjectsList.usersList;

    this.projectsList = this.taskEssentialInfoService.getUsersProjectsList.projectsList;

    this._subscription.add(
      this.api.getSubsetTask(this.loggedInUser.email, this.parentTaskData.taskId).subscribe((resp: ResultInterface) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'todo'});

        if (resp.result === 1) {
          this.tasks = resp.content.boards.list;

          this.tasks.map( task => {
            task.assignTo = this.usersList.filter(user => user.adminId === task.assignTo).pop();

            task.assigner = this.usersList.filter(user => user.adminId === task.assigner).pop().email;

            task.project = this.projectsList.filter(project => project.projectId === task.project).pop();

            return task;
          });

          this.sortTodo();
        }

        this.messageService.showMessage(resp.message);

        this.form.enable();
      }, (error: HttpErrorResponse) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'todo'});

        this.refreshLoginService.openLoginDialog(error);
      })
    );
  }

  checkTask(taskData) {
    this.form.disable();

    const formValue = {
      task: {
        taskId: taskData.taskId,
        taskName: taskData.taskName,
        assignTo: taskData.assignTo,
        taskDurationHours: taskData.taskDurationHours,
        taskDurationMinutes: taskData.taskDurationMinutes,
        startAt: taskData.startAt,
        stopAt: taskData.stopAt,
        project: taskData.project,
        status: taskData.status,
        taskDesc: taskData.taskDesc,
        percentage: taskData.boardStatus === 'done' ? 0 : 100,
        assigner: taskData.assigner,
        taskDateStart: taskData.taskDateStart,
        taskDateStop: taskData.taskDateStop,
        boardStatus: taskData.boardStatus === 'done' ? 'todo' : 'done',
        trackable: taskData.trackable,
        todoCount: taskData.todoCount,
        startTime: taskData.startTime,
        stopTime: taskData.stopTime,
        email: taskData.email
      },
    };

    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'todo'});

    this._subscription.add(
      this.api.taskChangeStatus(formValue.task, formValue.task.boardStatus).subscribe(async (resp: ResultTaskInterface) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'todo'});

        if (resp.result) {
          const newTask = resp.content;

          this.tasks = this.tasks.map(task => {
            if (task.taskId === newTask.taskId) {
              task = Object.assign(task, newTask);
            }
            return task;
          });

          this.sortTodo();
        }

        this.form.enable();

        this.messageService.showMessage(resp.message);
      }, (error: HttpErrorResponse) => {
        if (error.message) {
          this.messageService.showMessage(error.message);
        }

        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

        this.refreshLoginService.openLoginDialog(error);
      })
    );
  }

  deleteTask(task: TaskInterface) {
    this.form.disable();

    const dialogRef = this.dialog.open(ApproveComponent, {
      data: {
        title: this.getTranslate('tasks.task_detail.delete_title'),
        message: this.getTranslate('tasks.task_detail.delete_text')
      },
      autoFocus: false,
      width: '70vh',
      maxWidth: '350px',
      panelClass: 'approve-detail-dialog',
      height: '160px'
    });

    this.windowManagerService.dialogOnTop(dialogRef.id);

    this._subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'todo'});

          this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

          this._subscription.add(
            this.api.deleteTask(task).subscribe((resp: ResultTaskInterface) => {
              this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'todo'});

              if (resp.result === 1) {
                this.tasks = this.tasks.filter(newTask => newTask.taskId !== task.taskId);

                this.sortTodo();
              }

              this.messageService.showMessage(resp.message);

              this.form.enable();
            }, (error: HttpErrorResponse) => {
              if (error.message) {
                this.messageService.showMessage(error.message);
              }

              this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'todo'});

              this.refreshLoginService.openLoginDialog(error);
            })
          );
        }
      })
    );
  }

  addTask() {
    if (this.form.get('taskName').value !== '') {
      this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'todo'});

      this.form.disable();

      const formValue = {
        taskName: this.form.get('taskName').value,
        assignTo: this.parentTaskData.assignTo,
        taskDurationHours: 0,
        taskDurationMinutes: 0,
        startAt: '0000-00-00 00:00:00',
        stopAt: '0000-00-00 00:00:00',
        taskDateStart: '0000-00-00 00:00:00',
        taskDateStop: '0000-00-00 00:00:00',
        project: this.parentTaskData.project,
        taskDesc: '',
        percentage: 0,
        assigner: this.loggedInUser.email,
        boardStatus: 'todo',
        trackable: 0,
        startTime: '00:00',
        stopTime: '00:00',
        parentTaskId: this.parentTaskData.taskId
      };

      this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

      this._subscription.add(
        this.api.createTask(formValue).subscribe((resp: ResultTaskInterface) => {

          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'todo'});

          if (resp.result === 1) {
            this.tasks.push(resp.content);

            this.form.reset();

            this.sortTodo();
          }

          this.form.enable();

          this.messageService.showMessage(resp.message);
        }, (error: HttpErrorResponse) => {
          if (error.message) {
            this.messageService.showMessage(error.message);
          }

          this.form.enable();

          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'todo'});

          this.refreshLoginService.openLoginDialog(error);
        })
      );
    }
  }

  updateTask(task: TaskInterface) {
    this.edit = true;

    this.form.patchValue({
      taskId: task.taskId,
      taskName: task.taskName,
      percentage: task.percentage,
      assignTo: task.assignTo,
      taskDurationHours: task.taskDurationHours,
      taskDurationMinutes: task.taskDurationMinutes,
      startAt: task.startAt,
      stopAt: task.stopAt,
      startTime: task.startTime ? task.startTime : '00:00',
      stopTime: task.stopTime ? task.stopTime : '00:00',
      project: task.project,
      taskDesc: task.taskDesc,
      email: task.assignTo.email,
      boardStatus: task.boardStatus,
      taskDateStart: task.taskDateStart,
      taskDateStop: task.taskDateStop,
      assigner: task.assigner,
      trackable: task.trackable,
      parentTaskId: task.parentTaskId,
    });
  }

  saveTask() {
    if (this.form.get('taskName').value !== '') {

      this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'todo'});

      this.form.disable();

      this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

      this._subscription.add(
        this.api.updateTask(this.form.value).subscribe((resp: ResultTaskInterface) => {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'todo'});

          if (resp.result === 1) {
            const newTask = resp.content;

            this.tasks = this.tasks.map(task => {
              if (task.taskId === newTask.taskId) {
                task = Object.assign(task, newTask);
              }

              return task;
            });

            this.form.reset();

            this.edit = false;

            this.sortTodo();
          }

          this.form.enable();

          this.messageService.showMessage(resp.message);
        }, (error: HttpErrorResponse) => {
          if (error.message) {
            this.messageService.showMessage(error.message);
          }

          this.form.enable();

          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'todo'});

          this.refreshLoginService.openLoginDialog(error);
        })
      );
    }
  }

  openTask(task) {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'todo'});

    this.getBreadcrumbData(task.taskId).then(() => {
      this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'project'});
      this.bottomSheetData.bottomSheetRef.close();

      setTimeout(() => {
        const data: TaskDataInterface = {
          action: 'detail',
          usersList: this.usersList,
          projectsList: this.projectsList,
          task: task,
          boardStatus: task.boardStatus,
          breadcrumbList: this.breadcrumbList
        };

        const finalData = {
          component: TaskDetailComponent,
          height: '98%',
          width: '95%',
          data: data
        };

        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

        this.buttonSheetDataService.changeButtonSheetData(finalData);
      }, 500)
    })
  }

  getBreadcrumbData(taskId) {
    return new Promise((resolve) => {
      this._subscription.add(
        this.api.getBreadcrumb(taskId).subscribe((resp: any) => {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'todo'});

          if (resp.result === 1) {

            this.breadcrumbList = resp.content;

            resolve(true);
          }

          this.messageService.showMessage(resp.message);
        }, (error: HttpErrorResponse) => {
          if (error.message) {
            this.messageService.showMessage(error.message);
          }

          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'todo'});

          this.refreshLoginService.openLoginDialog(error);
        })
      );
    });
  }

  getTranslate(word) {
    return this.translateService.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
