import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-soft-phone-settings',
  templateUrl: './soft-phone-settings.component.html',
  styleUrls: ['./soft-phone-settings.component.scss']
})
export class SoftPhoneSettingsComponent implements OnInit {
  @Input()
  rtlDirection: boolean;

  constructor() {
  }

  ngOnInit(): void {
  }

}
