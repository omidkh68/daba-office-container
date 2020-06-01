import {Component, Input, OnInit} from '@angular/core';
import {SoftphoneUserInterface} from '../logic/softphone-user.interface';

@Component({
  selector: 'app-soft-phone-settings',
  templateUrl: './soft-phone-settings.component.html',
  styleUrls: ['./soft-phone-settings.component.scss']
})
export class SoftPhoneSettingsComponent implements OnInit {
  @Input()
  rtlDirection: boolean;

  @Input()
  softPhoneUsers: Array<SoftphoneUserInterface>;

  constructor() {
  }

  ngOnInit(): void {
  }

}
