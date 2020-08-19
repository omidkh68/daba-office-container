import {Injector} from '@angular/core';
import {LoginInterface} from '../components/login/logic/login.interface';
import {UserContainerInterface} from '../components/users/logic/user-container.interface';

export class LoginDataClass {
  loginData: LoginInterface;
  public loggedInUser: UserContainerInterface;
  allUsers: Array<UserContainerInterface> = [];

  constructor(private injectorObj: Injector,
              private userInfoServiceBase) {
    this.userInfoServiceBase.currentLoginData.subscribe(loginData => this.loginData = loginData);

    this.userInfoServiceBase.currentUserInfo.subscribe(user => this.loggedInUser = user);

    this.userInfoServiceBase.currentAllUsers.subscribe(users => this.allUsers = users)
  }
}
