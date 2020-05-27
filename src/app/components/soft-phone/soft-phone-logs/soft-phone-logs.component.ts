import {Component, Input, OnInit} from '@angular/core';
import {CallLogInterface} from '../logic/call-log.interface';

@Component({
  selector: 'app-soft-phone-logs',
  templateUrl: './soft-phone-logs.component.html',
  styleUrls: ['./soft-phone-logs.component.scss']
})
export class SoftPhoneLogsComponent implements OnInit {
  @Input()
  rtlDirection: boolean;

  callLogs: Array<CallLogInterface> = [
    {
      name: 'آقای بصیری',
      extension: 200,
      type: 'incoming',
      date: '2020-05-23',
      time: '10:53'
    },
    {
      name: 'محمود ملک لو',
      extension: 202,
      type: 'outgoing',
      date: '2020-05-20',
      time: '13:21'
    },
    {
      name: 'محمد حسین سجادی',
      extension: 231,
      type: 'incoming',
      date: '2020-05-18',
      time: '09:19'
    },
    {
      name: 'عمو رادان',
      extension: 209,
      type: 'missed',
      date: '2020-05-13',
      time: '14:44'
    }
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}
