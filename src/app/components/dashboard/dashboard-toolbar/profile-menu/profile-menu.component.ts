import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
// import {UserInterface} from '../../../users/logic/user-interface';
import {WindowManagerService} from '../../../../services/window-manager.service';
import {UserContainerInterface} from '../../../users/logic/user-container.interface';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss']
})
export class ProfileMenuComponent {
  @Input()
  loggedInUser: UserContainerInterface;

  @Input()
  rtlDirection: boolean;

  constructor(private _router: Router,
              private windowManagerService: WindowManagerService) {
  }

  logout() {
    this.windowManagerService.closeAllServices().then(() => {
      setTimeout(() => {
        this._router.navigateByUrl(`/login`);
      }, 500);
    });
  }
}
