import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {UsersProjectsListInterface} from '../components/tasks/logic/board-interface';

@Injectable({
  providedIn: 'root'
})
export class TaskEssentialInfoService {
  private _defaultUsersProjectsList: UsersProjectsListInterface | null = null;
  private usersProjectsList = new BehaviorSubject(this._defaultUsersProjectsList);
  public currentUsersProjectsList = this.usersProjectsList.asObservable();

  constructor() {
  }

  get getUsersProjectsList(): UsersProjectsListInterface {
    return this.usersProjectsList.getValue();
  }

  changeUsersProjectsList(usersProjectsList: UsersProjectsListInterface): void {
    this.usersProjectsList.next(usersProjectsList);
  }
}
