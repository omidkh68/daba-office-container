import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {UserInterface} from '../components/users/logic/user-interface';
import {ProjectInterface} from '../components/projects/logic/project-interface';

export interface UsersProjectsListInterface {
  usersList: UserInterface[];
  projectsList: ProjectInterface[];
}

@Injectable({
  providedIn: 'root'
})

export class TaskEssentialInfoService {

  private _defaultUsersProjectsList: UsersProjectsListInterface | null = null;
  private usersProjectsList = new BehaviorSubject(this._defaultUsersProjectsList);
  public currentUsersProjectsList = this.usersProjectsList.asObservable();

  constructor() {
  }

  get getUsersProjectsList() {
    return this.usersProjectsList.getValue();
  }

  changeUsersProjectsList(usersProjectsList) {
    this.usersProjectsList.next(usersProjectsList);
  }
}
