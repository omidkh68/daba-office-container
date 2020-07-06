import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from './logic/api.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs/internal/Subscription';
import {TodoInterface} from './logic/todo-interface';
import {LoginInterface} from '../../login/logic/login.interface';
import {MessageService} from '../../../services/message.service';
import {UserInfoService} from '../../users/services/user-info.service';
import {ApproveComponent} from '../../approve/approve.component';
import {HttpErrorResponse} from '@angular/common/http';
import {RefreshLoginService} from '../../login/services/refresh-login.service';
import {UserContainerInterface} from '../../users/logic/user-container.interface';
import {LoadingIndicatorService} from '../../../services/loading-indicator.service';

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

  form: FormGroup;
  edit: boolean = false;
  user: UserContainerInterface;

  todoList: TodoInterface[] = [];

  private _subscription: Subscription = new Subscription();

  constructor(private api: ApiService,
              public dialog: MatDialog,
              private fb: FormBuilder,
              private messageService: MessageService,
              private refreshLoginService: RefreshLoginService,
              private loadingIndicatorService: LoadingIndicatorService,
              private userInfoService: UserInfoService) {
    this._subscription.add(
      this.userInfoService.currentUserInfo.subscribe(user => this.user = user)
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
        componentId: [0],
        adminId: [0],
        isChecked: [0],
        text: [''],
        creationDate: ['']
      })
    });
  }

  getTodoList() {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'project'});

    this.form.disable();

    this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    this._subscription.add(
      this.api.getTodoList(this.taskId).subscribe((resp: any) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

        if (resp.result === 1) {
          this.todoList = resp.contents;

          this.form.enable();
        }
      }, (error: HttpErrorResponse) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

        this.refreshLoginService.openLoginDialog(error);
      })
    );
  }

  checkTodo(todoItem: TodoInterface) {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'project'});

    this.form.disable();

    const data = {
      taskId: this.taskId,
      todoId: todoItem.todoId,
      toggle: todoItem.isChecked ? 0 : 1
    };

    this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    this._subscription.add(
      this.api.toggleTodo(data).subscribe((resp: any) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

        if (resp.result === 1) {
          const newTodo: TodoInterface = resp.content.todo;

          this.todoList = this.todoList.map(item => {
            if (item.todoId === newTodo.todoId) {
              item = Object.assign({}, newTodo);
            }

            return item;
          });

          this.form.enable();
        }

        this.messageService.showMessage(resp.message);
      }, (error: HttpErrorResponse) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

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
      data: {title: 'حذف آیتم', message: 'آیا از حذف این آیتم اطمینان دارید؟'},
      autoFocus: false,
      width: '70vh',
      maxWidth: '350px',
      panelClass: 'approve-detail-dialog',
      height: '160px'
    });

    this._subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'project'});

          this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

          this._subscription.add(
            this.api.deleteTodo(data).subscribe((resp: any) => {
              this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

              if (resp.result === 1) {
                this.todoList = this.todoList.filter((todoItem: TodoInterface) => todoItem.todoId !== todo.todoId);

                this.form.enable();
              }

              this.messageService.showMessage(resp.message);
            }, (error: HttpErrorResponse) => {
              this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

              this.refreshLoginService.openLoginDialog(error);
            })
          );
        }
      })
    );
  }

  addTodo() {
    if (this.form.get('todo').value.text !== '') {

      this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'project'});

      this.form.disable();

      const data = {
        taskId: this.taskId,
        email: this.user.email,
        text: this.form.get('todo').value.text
      };

      this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

      this._subscription.add(
        this.api.createTodo(data).subscribe((resp: any) => {

          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

          if (resp.result === 1) {
            this.todoList.push(resp.content.todo);

            const todoValue = this.form.get('todo').value;

            this.form.get('todo').setValue({...todoValue, text: ''});

            this.form.enable();
          }

          this.messageService.showMessage(resp.message);
        }, (error: HttpErrorResponse) => {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

          this.refreshLoginService.openLoginDialog(error);
        })
      );
    }
  }

  saveTodo() {
    if (this.form.get('todo').value.text !== '') {

      this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'project'});

      this.form.disable();

      const data = {
        todoId: this.form.get('todo').value.todoId,
        taskId: this.taskId,
        email: this.user.email,
        text: this.form.get('todo').value.text
      };

      this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

      this._subscription.add(
        this.api.updateTodo(data).subscribe((resp: any) => {

          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

          if (resp.result === 1) {
            const newTodo: TodoInterface = resp.content.todo;

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
          }

          this.messageService.showMessage(resp.message);
        }, (error: HttpErrorResponse) => {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

          this.refreshLoginService.openLoginDialog(error);
        })
      );
    }
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
