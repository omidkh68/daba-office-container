import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {TaskInterface} from '../logic/task-interface';

@Injectable({
  providedIn: 'root'
})
export class CurrentTaskService {
  private _task: Array<TaskInterface> | null = null;
  private task = new BehaviorSubject(this._task);
  public currentTask = this.task.asObservable();

  changeCurrentTask(currentTask: Array<TaskInterface> | null): void {
    this.task.next(currentTask);
  }
}
