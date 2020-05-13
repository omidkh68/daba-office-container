import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {TaskInterface} from '../components/tasks/logic/task-interface';

@Injectable({
  providedIn: 'root'
})
export class CurrentTaskService {
  private _task: Array<TaskInterface> | null;

  // set observable behavior to property
  private task = new BehaviorSubject(this._task);

  // observable property
  public currentTask = this.task.asObservable();

  changeCurrentTask(currentTask: Array<TaskInterface> | null) {
    this.task.next(currentTask);
  }
}
