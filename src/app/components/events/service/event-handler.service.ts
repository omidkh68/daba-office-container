import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {ReminderInterface} from '../logic/event-reminder.interface';
import {EventHandlerInterface, EventsReminderInterface} from '../logic/event-handler.interface';
import {TaskCalendarRateInterface} from "../../tasks/task-calendar/services/task-calendar.service";

@Injectable({
  providedIn: 'root'
})
export class EventHandlerService {
  private _events: Array<EventHandlerInterface> | null = null;
  private events = new BehaviorSubject(this._events);
  public currentEventsList = this.events.asObservable();

  private _eventsTask: Array<any> | null = null;
  private eventsTask = new BehaviorSubject(this._eventsTask);
  public currentEventsTaskList = this.eventsTask.asObservable();

  private _calendarRate: TaskCalendarRateInterface| null = null;
  private calendarRate = new BehaviorSubject(this._calendarRate);
  public currentCalendarRate = this.calendarRate.asObservable();

  private _event_reminder: EventsReminderInterface | null = null;
  private event_reminder = new BehaviorSubject(this._event_reminder);
  public currentEventsReminderList = this.event_reminder.asObservable();

  private _eventItems: EventHandlerInterface | null = null;
  private eventItems = new BehaviorSubject(this._eventItems);
  public currentEventItems = this.eventItems.asObservable();

  private _reminders: Array<ReminderInterface> | null = null;
  private reminders = new BehaviorSubject(this._reminders);
  public currentRemindersList = this.reminders.asObservable();

  private _day: Date | null = null;
  private day = new BehaviorSubject(this._day);
  public currentDate = this.day.asObservable();

  public moveEventsReminders(eventReminders: EventsReminderInterface | null) {
    this.event_reminder.next(eventReminders);
  }

  public moveEventsTask(eventsTask: Array<any> | null) {
    this.eventsTask.next(eventsTask);
  }

  public moveCalendarRate(calendarRate: TaskCalendarRateInterface | null) {
    this.calendarRate.next(calendarRate);
  }

  public moveEvents(events: Array<EventHandlerInterface> | null) {
    this.events.next(events);
  }

  public moveEventItems(eventItems: EventHandlerInterface | null) {
    this.eventItems.next(eventItems);
  }

  public moveReminders(reminders: Array<ReminderInterface> | null) {
    this.reminders.next(reminders);
  }

  public moveDay(date: Date | null) {
    this.day.next(date);
  }

}
