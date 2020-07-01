import {Injector} from '@angular/core';
import {LoginInterface} from '../components/users/logic/login.interface';
import {UserContainerInterface} from '../components/users/logic/user-container.interface';

export class LoginDataClass {
  loginData: LoginInterface;
  loggedInUser: UserContainerInterface;

  constructor(private injectorObj: Injector,
              private userInfoServiceBase) {
    this.userInfoServiceBase.currentLoginData.subscribe(loginData => this.loginData = loginData);

    this.userInfoServiceBase.currentUserInfo.subscribe(user => this.loggedInUser = user);
  }
}
