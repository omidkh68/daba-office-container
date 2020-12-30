import {Injectable} from '@angular/core';
import {UserInterface} from '../../../users/logic/user-interface';
import {SoftphoneUserInterface} from '../../../soft-phone/logic/softphone-user.interface';
import {BehaviorSubject} from 'rxjs';
import {ProjectInterface} from '../../../projects/logic/project-interface';

@Injectable({
  providedIn: 'root'
})
export class TaskCalendarService {
  colorArray = [
    '#f44336',
    '#e91e63',
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    '#03a9f4',
    '#00bcd4',
    '#009688',
    '#4caf50',
    '#8bc34a',
    '#cddc39',
    '#dbc00d',
    '#ffc107',
    '#ff9800',
    '#ff5722',
    '#795548',
    '#9e9e9e',
    '#ff9800',
    '#607d8b',
    '#444444',
  ];

  private _users: Array<SoftphoneUserInterface> | null = null;
  private users = new BehaviorSubject(this._users);
  public currentSoftPhoneUsers = this.users.asObservable();
  private _holidays: Array<String>;

  public get holidays() {
    return this._holidays;
  }

  public set holidays(theHolidays: Array<String>) {
    this._holidays = theHolidays;
  }

  getDaysArray(start, end) {
    for (var arr = [], dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      arr.push(new Date(dt));
    }
    return arr;
  }

  prepareTaskItems(resp: any) {
    let taskList = resp.content.boards.list;
    let myArray = [];
    taskList.map((task: any) => {
      let arr = this.getDaysArray(new Date(task.startAt), new Date(task.stopAt));
      let color = this.colorArray[Math.floor(Math.random() * this.colorArray.length)];
      arr.map((item) => {
        let obj = {
          title: task.taskName,
          color: color,
          imageurl: 'assets/profileImg/' + task.assignTo.email + '.jpg',
          start: item,
          end: item,
          usersList: resp.content.users.list,
          projectsList: resp.content.projects.list
        };
        let newObj = Object.assign(obj, task);

        let checkDae = item.getFullYear() + '-' + ('0' + (item.getMonth() + 1)).slice(-2) + '-' + ('0' + item.getDate()).slice(-2);

        if (!this._holidays.includes(checkDae))
          myArray.push(newObj);
      });
    });
    return myArray;
  }
}

export interface CalendarItemInterface {
  end: Date,
  start: Date,
  title: string
}

export interface TaskCalendarRateInterface {
  calendarEvent: CalendarItemInterface[],
  dateStart: string,
  sumTime: string,
  userSelected: UserInterface,
  filterData: any
}

export interface CalendarItemsInterface {
  title: string,
  color: string,
  imageurl: string,
  start: Date,
  end: Date,
  usersList: UserInterface[],
  projectsList: ProjectInterface[]
}
