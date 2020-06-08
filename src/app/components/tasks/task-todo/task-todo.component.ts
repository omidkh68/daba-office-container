import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TodoInterface} from './logic/todo-interface';
import {Subscription} from 'rxjs/internal/Subscription';
import {ApiService} from './logic/api.service';
import {UserInterface} from '../../users/logic/user-interface';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserInfoService} from '../../users/services/user-info.service';

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

  form: FormGroup;
  edit: boolean = false;
  user: UserInterface;

  todoList: TodoInterface[] = [];

  private _subscription: Subscription = new Subscription();

  constructor(private apiService: ApiService,
              private fb: FormBuilder,
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
    this.form.disable();

    this._subscription.add(
      this.apiService.getTodoList(this.taskId).subscribe((resp: any) => {
        if (resp.result === 1) {
          this.todoList = resp.contents;

          this.form.enable();
        }
      })
    );
  }

  checkTodo(todoItem: TodoInterface) {
    this.form.disable();

    const data = {
      taskId: this.taskId,
      todoId: todoItem.todoId,
      toggle: todoItem.isChecked ? 0 : 1
    };

    this._subscription.add(
      this.apiService.toggleTodo(data).subscribe((resp: any) => {
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

    this._subscription.add(
      this.apiService.deleteTodo(data).subscribe((resp: any) => {
        if (resp.result === 1) {
          this.todoList = this.todoList.filter((todoItem: TodoInterface) => todoItem.todoId !== todo.todoId);

          this.form.enable();
        }
      })
    );
  }

  addTodo() {
    if (this.form.get('todo').value.text !== '') {
      this.form.disable();

      const data = {
        taskId: this.taskId,
        adminId: this.user.adminId,
        text: this.form.get('todo').value.text
      };

      this._subscription.add(
        this.apiService.createTodo(data).subscribe((resp: any) => {
          if (resp.result === 1) {
            this.todoList.push(resp.content.todo);

            const todoValue = this.form.get('todo').value;

            this.form.get('todo').setValue({...todoValue, text: ''});

            this.form.enable();
          }
        })
      );
    }
  }

  saveTodo() {
    if (this.form.get('todo').value.text !== '') {
      this.form.disable();

      const data = {
        todoId: this.form.get('todo').value.todoId,
        taskId: this.taskId,
        adminId: this.user.adminId,
        text: this.form.get('todo').value.text
      };

      this._subscription.add(
        this.apiService.updateTodo(data).subscribe((resp: any) => {
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
