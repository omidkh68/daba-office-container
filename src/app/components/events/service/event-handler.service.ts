import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {EventHandlerInterface, EventsReminderInterface} from '../logic/event-handler.interface';
import {ReminderInterface} from '../logic/event-reminder.interface';

@Injectable({
  providedIn: 'root'
})
export class EventHandlerService {
  private _events: Array<EventHandlerInterface> | null;
  private events = new BehaviorSubject(this._events);
  public currentEventsList = this.events.asObservable();

  private _event_reminder: EventsReminderInterface | null;
  private event_reminder = new BehaviorSubject(this._event_reminder);
  public currentEventsReminderList = this.event_reminder.asObservable();

  private _eventItems: EventHandlerInterface | null;
  private eventItems = new BehaviorSubject(this._eventItems);
  public currentEventItems = this.eventItems.asObservable();

  private _reminders: Array<ReminderInterface> | null;
  private reminders = new BehaviorSubject(this._reminders);
  public currentRemindersList = this.reminders.asObservable();

  private _test: EventHandlerInterface;
  private test = new BehaviorSubject(this._test);
  public currentTest = this.test.asObservable();

  private _day: Date | null;
  private day = new BehaviorSubject(this._day);
  public currentDate = this.day.asObservable();

  public moveEventsReminders(eventReminders: EventsReminderInterface | null) {
    this.event_reminder.next(eventReminders);
  }

  public moveEvents(events: Array<EventHandlerInterface> | null) {
    this.events.next(events);
  }

  public moveEventItems(eventItems: EventHandlerInterface | null) {
    this.eventItems.next(eventItems);
  }

  public testItems(test: EventHandlerInterface) {
    this.test.next(test);
  }

  public moveReminders(reminders: Array<ReminderInterface> | null) {
    this.reminders.next(reminders);
  }

  public moveDay(date: Date | null) {
    this.day.next(date);
  }
}
