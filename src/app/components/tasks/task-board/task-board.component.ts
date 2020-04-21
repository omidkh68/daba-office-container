// import * as io from 'socket.io-client';
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

  // socket = io('http://localhost:4000');
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

    /*this.socket.on('update-data', (data: any) => {
      this.getBoards();
    });*/
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
          const newTask = resp.task;
          const project: ProjectInterface = await this.projectsList.filter(project => project.projectID === newTask.project).pop();
          const assignTo: UserInterface = await this.usersList.filter(user => user.adminId === newTask.assignTo).pop();
          const assigner: UserInterface = await this.usersList.filter(user => user.adminId === newTask.assigner).pop();

          await this.boards.map(board => {
            if (board.id === event.container.id) {
              board.tasks.map(task => {
                if (task.taskID === newTask.taskID) {
                  newTask.assignTo = assignTo;
                  newTask.assigner = assigner;
                  newTask.project = project;

                  task = Object.assign(task, newTask);
                }

                return task;
              });
            }
          });
        })
      );
    }
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
      height: '520px'
    });

    this._subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // this.socket.emit('updatedata', result);
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

    console.log(info);

    this.usersList = info.content.users.list;
    this.projectsList = info.content.projects.list;

    this.pushTaskEssentialInfo.emit({usersList: this.usersList, projectsList: this.projectsList});

    info.content.boards.list.map(task => {
      // determine todoList, inProgressList, doneList into board array
      switch (this.getBoardStatus(task)) {
        case 0:
          inProgress_tasks.push(task);
          break;

        case 1:
          todo_tasks.push(task);
          break;

        case 2:
          todo_tasks.push(task);
          break;

        case 3:
          done_tasks.push(task);
          break;

        case 4:
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

  getBoardStatus(task: TaskInterface): number {
    let result = 0;

    // 0- task is start and should show stop button (in progress list)
    if (task.taskDateStart !== '0000-00-00 00:00:00' && task.taskDateStop === '0000-00-00 00:00:00') {
      result = 0;
    }
    // 1- task was not start yet and should show play button (to-do list)
    else if (task.taskDateStart === '0000-00-00 00:00:00' && task.taskDateStop === '0000-00-00 00:00:00' && task.percentage !== 100) {
      result = 1;
    }
    // 2- task is not complete yet and should show play button (to-do list)
    else if (task.taskDateStart !== '0000-00-00 00:00:00' && task.taskDateStop !== '0000-00-00 00:00:00' && task.percentage !== 100) {
      result = 2;
    }
    // 3- task is completed and could show play button (done list)
    else if (task.taskDateStart !== '0000-00-00 00:00:00' && task.taskDateStop !== '0000-00-00 00:00:00' && task.percentage === 100) {
      result = 3;
    }
    // 4- task is not start yet by user but is completed then should show play button (done list)
    else if (task.taskDateStart === '0000-00-00 00:00:00' && task.taskDateStop === '0000-00-00 00:00:00' && task.percentage === 100) {
      result = 4;
    }

    return result;
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (this.refreshData) {
      // this.socket.emit('updatedata');
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
