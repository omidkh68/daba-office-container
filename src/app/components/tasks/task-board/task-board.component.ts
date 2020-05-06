import * as io from 'socket.io-client';
import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../logic/api.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Subscription} from 'rxjs/internal/Subscription';
import {UserInterface} from '../../users/logic/user-interface';
import {TaskInterface} from '../logic/task-interface';
import {BoardInterface} from '../logic/board-interface';
import {ProjectInterface} from '../../projects/logic/project-interface';
import {TaskDataInterface} from '../logic/task-data-interface';
import {TaskDetailComponent} from '../task-detail/task-detail.component';
import {TaskStopComponent} from '../task-stop/task-stop.component';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss']
})
export class TaskBoardComponent implements OnInit, OnDestroy, OnChanges {
  @Output()
  pushTaskEssentialInfo = new EventEmitter();

  @Input()
  refreshData: boolean = false;

  @Input()
  filterBoards: any;

  socket = io('http://localhost:4000');
  rowHeight: string = '0';
  connectedTo = [];
  boards: BoardInterface[] = [];
  usersList: UserInterface[] = [];
  projectsList: ProjectInterface[] = [];

  private _subscription: Subscription = new Subscription();

  constructor(private api: ApiService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.rowHeight = '100%';

    this.getBoards();

    this.socket.on('update-data', (data: any) => {
      this.getBoards();
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);

      let taskData = event.item.data;

      this._subscription.add(
        this.api.taskChangeStatus(taskData, event.container.id).subscribe(async (resp: any) => {
          const newTask = resp.content.task;
          const project: ProjectInterface = await this.projectsList.filter(project => project.projectId === newTask.project.projectId).pop();
          const assignTo: UserInterface = await this.usersList.filter(user => user.adminId === newTask.assignTo.adminId).pop();
          const assigner: UserInterface = await this.usersList.filter(user => user.adminId === newTask.assigner.adminId).pop();

          await this.boards.map(board => {
            if (board.id === event.container.id) {
              board.tasks.map(task => {
                if (task.taskId === newTask.taskId) {
                  newTask.assignTo = assignTo;
                  newTask.assigner = assigner;
                  newTask.project = project;

                  task = Object.assign(task, newTask);
                }

                return task;
              });
            }
          });

          if (event.previousContainer.id === 'inProgress' && (event.container.id === 'todo' || event.container.id === 'done')) {
            this.showTaskStopModal(newTask);
          } else if (event.previousContainer.id === 'todo' && event.container.id === 'done') {
            this.showTaskStopModal(newTask);
          }
        })
      );
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
          this.socket.emit('updatedata', result);
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

    const dialogRef = this.dialog.open(TaskDetailComponent, {
      data: data,
      autoFocus: false,
      width: '50%',
      height: '560px'
    });

    this._subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.socket.emit('updatedata', result);
        }
      })
    );
  }

  getBoards() {
    this._subscription.add(
      this.api.boards(1).subscribe((resp: any) => {
        if (resp.result === 1) {
          this.putTasksToAllBoards(resp);
        }
      })
    );
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

    info.content.boards.list.map((task: TaskInterface) => {
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
      name: 'آماده انجام',
      tasks: todo_tasks
    });

    this.boards.push({
      id: 'inProgress',
      cols: 1,
      rows: 1,
      name: 'در حال انجام',
      tasks: inProgress_tasks
    });

    this.boards.push({
      id: 'done',
      cols: 1,
      rows: 1,
      name: 'به اتمام رسیده',
      tasks: done_tasks
    });

    for (let board of this.boards) {
      this.connectedTo.push(board.id);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.refreshData) {
      this.socket.emit('updatedata');
    }

    if (changes.filterBoards && !changes.filterBoards.firstChange) {
      this.filterBoards = changes.filterBoards.currentValue;

      this.putTasksToAllBoards(this.filterBoards.resp);
    }
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
