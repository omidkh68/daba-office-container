import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from './logic/api.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs/internal/Subscription';
import {TodoInterface} from './logic/todo-interface';
import {LoginInterface} from '../../login/logic/login.interface';
import {MessageService} from '../../../services/message.service';
import {ApproveComponent} from '../../approve/approve.component';
import {TranslateService} from '@ngx-translate/core';
import {HttpErrorResponse} from '@angular/common/http';
import {RefreshBoardService} from '../services/refresh-board.service';
import {RefreshLoginService} from '../../login/services/refresh-login.service';
import {UserContainerInterface} from '../../users/logic/user-container.interface';
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
  rtlDirection: boolean;

  @Input()
  loginData: LoginInterface;

  @Input()
  loggedInUser: UserContainerInterface;

  form: FormGroup;
  edit: boolean = false;
  user: UserContainerInterface;
  loadingIndicator: LoadingIndicatorInterface = {status: false, serviceName: 'todo'};

  todoList: TodoInterface[] = [];

  private _subscription: Subscription = new Subscription();

  constructor(private api: ApiService,
              public dialog: MatDialog,
              private fb: FormBuilder,
              private messageService: MessageService,
              private refreshLoginService: RefreshLoginService,
              private translateService: TranslateService,
              private refreshBoardService: RefreshBoardService,
              private loadingIndicatorService: LoadingIndicatorService) {
    this._subscription.add(
      this.loadingIndicatorService.currentLoadingStatus.subscribe(status => this.loadingIndicator = status)
    );
  }

  ngOnInit(): void {
    this.createForm();

    this.getTodoList();
  }

  createForm() {
    this.form = this.fb.group({
      todo: this.fb.group({
        todoId: [0],
        taskId: [0],
        email: [''],
        isChecked: [0],
        text: [''],
        creationDate: ['']
      })
    });
  }

  getTodoList() {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'todo'});

    this.form.disable();

    this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    this._subscription.add(
      this.api.getTodoList(this.taskId).subscribe((resp: any) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'todo'});

        if (resp.result === 1) {
          this.todoList = resp.contents;

          this.form.enable();

          this.sortTodo();
        }
      }, (error: HttpErrorResponse) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'todo'});

        this.refreshLoginService.openLoginDialog(error);
      })
    );
  }

  checkTodo(todoItem: TodoInterface) {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'todo'});

    this.form.disable();

    const data = {
      ...todoItem,
      isChecked: todoItem.isChecked ? 0 : 1
    };

    this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    this._subscription.add(
      this.api.updateTodo(data).subscribe((resp: any) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'todo'});

        if (resp.result === 1) {
          const newTodo: TodoInterface = resp.content;

          this.todoList = this.todoList.map(item => {
            if (item.todoId === newTodo.todoId) {
              item = Object.assign({}, newTodo);
            }

            return item;
          });

          this.form.enable();

          this.sortTodo();
        }

        this.messageService.showMessage(resp.message);
      }, (error: HttpErrorResponse) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'todo'});

        this.refreshLoginService.openLoginDialog(error);
      })
    );
  }

  updateTodo(todo: TodoInterface) {
    this.edit = true;

    this.form.get('todo').setValue(todo);
  }

  deleteTodo(todo: TodoInterface) {
    this.form.disable();

    const data = {
      todoId: todo.todoId,
      taskId: this.taskId
    };

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

    this._subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'todo'});

          this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

          this._subscription.add(
            this.api.deleteTodo(data).subscribe((resp: any) => {
              this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'todo'});

              if (resp.result === 1) {
                this.todoList = this.todoList.filter((todoItem: TodoInterface) => todoItem.todoId !== todo.todoId);

                this.form.enable();

                // this.refreshBoardService.changeCurrentDoRefresh(true);
              }

              this.messageService.showMessage(resp.message);
            }, (error: HttpErrorResponse) => {
              this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'todo'});

              this.refreshLoginService.openLoginDialog(error);
            })
          );
        }
      })
    );
  }

  addTodo() {
    if (this.form.get('todo').value.text !== '') {

      this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'todo'});

      this.form.disable();

      const data = {
        taskId: this.taskId,
        email: this.loggedInUser.email,
        isChecked: 0,
        text: this.form.get('todo').value.text
      };

      this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

      this._subscription.add(
        this.api.createTodo(data).subscribe((resp: any) => {

          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'todo'});

          if (resp.result === 1) {
            this.todoList.push(resp.content);

            const todoValue = this.form.get('todo').value;

            this.form.get('todo').setValue({...todoValue, text: ''});

            this.form.enable();

            // this.refreshBoardService.changeCurrentDoRefresh(true);

            this.sortTodo();
          }

          this.messageService.showMessage(resp.message);
        }, (error: HttpErrorResponse) => {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'todo'});

          this.refreshLoginService.openLoginDialog(error);
        })
      );
    }
  }

  saveTodo() {
    if (this.form.get('todo').value.text !== '') {

      this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'todo'});

      this.form.disable();

      const data = {
        todoId: this.form.get('todo').value.todoId,
        taskId: this.taskId,
        email: this.loggedInUser.email,
        isChecked: this.form.get('todo').value.isChecked,
        text: this.form.get('todo').value.text
      };

      this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

      this._subscription.add(
        this.api.updateTodo(data).subscribe((resp: any) => {

          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'todo'});

          if (resp.result === 1) {
            const newTodo: TodoInterface = resp.content;

            this.todoList = this.todoList.map(item => {
              if (item.todoId === newTodo.todoId) {
                item = Object.assign({}, newTodo);
              }

              return item;
            });

            const todoValue = this.form.get('todo').value;

            this.form.get('todo').setValue({...todoValue, text: ''});

            this.edit = false;

            this.form.enable();

            this.sortTodo();
          }

          this.messageService.showMessage(resp.message);
        }, (error: HttpErrorResponse) => {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'todo'});

          this.refreshLoginService.openLoginDialog(error);
        })
      );
    }
  }

  sortTodo() {
    this.todoList.sort((first, second) => {
      const a = first.isChecked;
      const b = second.isChecked;

      let comparison = 0;
      if (a > b) {
        comparison = 1;
      } else if (a < b) {
        comparison = -1;
      }
      return comparison;
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
