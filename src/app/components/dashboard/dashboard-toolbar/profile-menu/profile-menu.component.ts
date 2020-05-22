import {Component, Input} from '@angular/core';
import {UserInterface} from '../../../users/logic/user-interface';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss']
})
export class ProfileMenuComponent {
  @Input()
  loggedInUser: UserInterface;

  @Input()
  rtlDirection: boolean;

  constructor() {
  }
}
