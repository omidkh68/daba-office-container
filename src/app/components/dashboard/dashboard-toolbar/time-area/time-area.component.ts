import {Component, Input} from '@angular/core';
import {UserInterface} from '../../../users/logic/user-interface';

@Component({
  selector: 'app-time-area',
  templateUrl: './time-area.component.html',
  styleUrls: ['./time-area.component.scss']
})
export class TimeAreaComponent {
  @Input()
  loggedInUser: UserInterface;

  @Input()
  rtlDirection: boolean;

  constructor() {
  }
}
