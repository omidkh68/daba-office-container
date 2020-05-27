import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-soft-phone-contacts',
  templateUrl: './soft-phone-contacts.component.html',
  styleUrls: ['./soft-phone-contacts.component.scss']
})
export class SoftPhoneContactsComponent implements OnInit {
  @Input()
  rtlDirection: boolean;

  data;

  constructor() {
  }

  ngOnInit(): void {
    console.log('from outside', this.data);
  }

}
