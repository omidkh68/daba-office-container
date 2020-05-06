import {Component, OnInit} from '@angular/core';
import {NbWindowService} from '@nebular/theme';
import {TaskMessagesComponent} from '../tasks/task-messages/task-messages.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private windowService: NbWindowService) {
  }

  ngOnInit(): void {
  }

  openApi() {
    const windowRef = this.windowService.open(TaskMessagesComponent, {
      title: 'Task Management'
    });
  }


}
