import * as io from 'socket.io-client';
import {AppConfig} from '../../environments/environment';
import {UserInterface} from '../components/users/logic/user-interface';
import {Subscription} from 'rxjs/internal/Subscription';
import {Injectable} from '@angular/core';
import {UserInfoService} from '../components/users/services/user-info.service';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket;
  loggedInUser: UserInterface;

  private _subscription: Subscription = new Subscription();

  constructor(private userInfoService: UserInfoService) {
    this._subscription.add(
      this.userInfoService.currentUserInfo.subscribe(user => this.loggedInUser = user)
    );
  }

  setupSocketConnection(componentName) {
    this.socket = io(AppConfig.socketUrl, {
      query: {
        token: 'cde',
        userId: this.loggedInUser.adminId,
        componentName: componentName
      }
    });

    /*this.socket.emit('my message', 'hello there from angular');

    this.socket.on('my broadcast', (data: string) => {
      console.log(data);
    });*/

    return this.socket;
  }
}
