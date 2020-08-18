import * as io from 'socket.io-client';
import {AppConfig} from '../../environments/environment';
import {Injectable} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {UserInfoService} from '../components/users/services/user-info.service';
import {UserContainerInterface} from '../components/users/logic/user-container.interface';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket;
  loggedInUser: UserContainerInterface;

  private _subscription: Subscription = new Subscription();

  constructor(private userInfoService: UserInfoService) {
    this._subscription.add(
      this.userInfoService.currentUserInfo.subscribe(user => this.loggedInUser = user)
    );
  }

  setupSocketConnection(componentName) {
    this.socket = io(AppConfig.SOCKET_URL, {
      query: {
        token: 'cde',
        userEmail: this.loggedInUser.email,
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
