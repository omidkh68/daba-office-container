import {Injectable} from '@angular/core';
import {UserInterface} from '../../../users/logic/user-interface';
import {TaskInterface} from '../../logic/task-interface';
import {ProjectInterface} from '../../../projects/logic/project-interface';
import {SoftphoneUserInterface} from '../../../soft-phone/logic/softphone-user.interface';

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

  private _holidays: Array<string>;

  public get holidays(): Array<string> {
    return this._holidays;
  }

  public set holidays(theHolidays: Array<string>) {
    this._holidays = theHolidays;
  }

  getDaysArray(start: Date, end: Date): Array<Date> {
    const arr: Array<Date> = [];

    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      arr.push(new Date(dt));
    }

    return arr;
  }

  prepareTaskItems(resp: any): Array<CalendarAndTaskItemsInterface> {
    const taskList = resp.contents.boards.list;
    const myArray = [];

    taskList.map((task: TaskInterface) => {
      const arr = this.getDaysArray(new Date(task.startAt), new Date(task.stopAt));
      const color = this.colorArray[Math.floor(Math.random() * this.colorArray.length)];

      arr.map((item) => {
        const obj: CalendarItemsInterface = {
          title: task.taskName,
          color: color,
          imageurl: `assets/profileImg/${task.assignTo.email}.jpg`,
          start: item,
          end: item,
          usersList: resp.contents.users.list,
          projectsList: resp.contents.projects.list
        };

        const newObj: CalendarAndTaskItemsInterface = {...obj, ...task};
        const checkDate = `${item.getFullYear()}-${(`0${(item.getMonth() + 1)}`).slice(-2)}-${(`0${item.getDate()}`).slice(-2)}`;

        if (!this._holidays.includes(checkDate)) {
          myArray.push(newObj);
        }
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
  usersList: Array<UserInterface>,
  projectsList: Array<ProjectInterface>
}

export interface CalendarAndTaskItemsInterface extends TaskInterface, CalendarItemsInterface {
}
