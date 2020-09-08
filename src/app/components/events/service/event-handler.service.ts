import {Injectable} from '@angular/core';

import {BehaviorSubject} from "rxjs";
import {EventHandlerInterface} from "../logic/event-handler.interface";
import {ReminderInterface} from "../logic/event-reminder.interface";

@Injectable({
  providedIn: 'root'
})
export class EventHandlerService {

  private _events: Array<EventHandlerInterface> | null;
  private events = new BehaviorSubject(this._events);
  public currentEventsList = this.events.asObservable();

  private _eventItems: EventHandlerInterface | null;
  private eventItems = new BehaviorSubject(this._eventItems);
  public currentEventItems = this.eventItems.asObservable();

  private _reminders: Array<ReminderInterface> | null;
  private reminders = new BehaviorSubject(this._reminders);
  public currentRemindersList = this.reminders.asObservable();

  private _day: Date | null;
  private day = new BehaviorSubject(this._day);
  public currentDate = this.day.asObservable();


  public moveEvents(events: Array<EventHandlerInterface>) {
    this.events.next(events);
  }
  public moveEventItems(eventItems: EventHandlerInterface) {
    this.eventItems.next(eventItems);
  }
  public moveReminders(reminders: Array<ReminderInterface>) {
    this.reminders.next(reminders);
  }
  public moveDay(date: Date) {
    this.day.next(date);
  }
}
