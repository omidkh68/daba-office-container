import * as moment from 'moment';
import {Subject} from 'rxjs/internal/Subject';
import {AppConfig} from '../../../../environments/environment';
import {Injectable} from '@angular/core';
import {Subscription} from 'rxjs';
import {MessageService} from '../../message/service/message.service';
import {EventApiService} from '../logic/api.service';
import {ElectronService} from '../../../core/services';
import {DatetimeService} from '../../dashboard/dashboard-toolbar/time-area/service/datetime.service';
import {TranslateService} from '@ngx-translate/core';
import {ReminderInterface} from '../logic/event-reminder.interface';
import {NotificationService} from '../../../services/notification.service';
import {EventHandlerService} from './event-handler.service';
import {EventHandlerInterface} from '../logic/event-handler.interface';
import {EventHandlerEmailDate, UserContainerInterface} from '../../users/logic/user-container.interface';

declare let SockJS;
declare let Stomp;

@Injectable({
  providedIn: 'root'
})
export class EventHandlerSocketService {
  public stompClient;
  public msg = new Subject();
  public connectedStatus: Subject<boolean> = new Subject();
  private loggedInUsers: any;
  private _subscription: Subscription = new Subscription();

  constructor(private eventApi: EventApiService,
              private messageService: MessageService,
              private electronService: ElectronService,
              private dateTimeservice: DatetimeService,
              private translateService: TranslateService,
              private notificationService: NotificationService,
              private eventHandlerService: EventHandlerService) {
  }

  public getEventsByEmail(eventHandlerModel: EventHandlerEmailDate, user: UserContainerInterface) {
    this.loggedInUsers = user;
    return new Promise((resolve) => {
      this.eventApi.getEventByEmail(eventHandlerModel).subscribe((resp: any) => {
        let events = [];
        let reminders = [];
        if (resp.status == 200) {
          if (resp.contents) {
            if (resp.contents.length) {
              events = resp.contents;
              events.map((item: EventHandlerInterface) => {
                item.sTime = new Date(item.startDate).toLocaleTimeString();
                item.eTime = new Date(item.endDate).toLocaleTimeString();
                item.startDate = this.dateTimeservice.getDateByTimezone(item.startDate, user.timezone);
                item.endDate = this.dateTimeservice.getDateByTimezone(item.endDate, user.timezone);
                if (item.reminders.length)
                  reminders = [...reminders, ...item.reminders];
              });
              reminders.map((item: ReminderInterface) => {
                item.startdate_format = new Date(item.startReminder).toLocaleDateString();
                item.enddate_format = new Date(item.endReminder).toLocaleDateString();
                item.startReminder = this.dateTimeservice.getDateByTimezone(item.startReminder, user.timezone);
                item.endReminder = this.dateTimeservice.getDateByTimezone(item.endReminder, user.timezone);
              });
              const data = {events: events, reminders: reminders};
              this.eventHandlerService.moveEventsReminders(data);
              resolve(data);
            }
          } else {
            this.messageService.showMessage(resp.error, 'error');

            resolve({events: [], reminders: []});
          }
        } else {
          this.messageService.showMessage(resp.error, 'error');

          resolve({events: [], reminders: []});
        }
      });
    });
  }

  public initializeWebSocketConnection() {
    return new Promise((resolve, reject) => {
      const serverUrl = AppConfig.EVENT_HANDLER_URL + '/api';
      const ws = new SockJS(serverUrl);
      this.stompClient = Stomp.over(ws);
      this.stompClient.debug = () => {
      };
      this.stompClient.reconnect_delay = 2000;
      this.stompClient.connect({}, (msg) => {
        resolve(msg);
        this.connectedStatus.next(true);

        this.stompClient.subscribe('/calendar', (message) => {

          let checkNotify = JSON.parse(message.body);
          let notification: Notification;
          if (Array.isArray(checkNotify)) {
            // receive new reminder
            checkNotify = checkNotify[0];
            if (this.electronService.isElectron) {
              if (!this.electronService.remote.getCurrentWindow().isFocused()) {
                notification = new Notification(this.getTranslate('events_handler.main.notification_reminder_title'), {
                  body: checkNotify.description + ' ' + checkNotify.startReminder,//this.getTranslate('events_handler.main.notification_reminder_from'),
                  icon: '',
                  dir: 'auto',
                  data: this.loggedInUsers
                });
              }
            }
          } else {
            // receive new event
            if (checkNotify.users && checkNotify.users.length) {
              checkNotify.users.forEach((item) => {
                //if(item.email == this.loggedInUsers.email){
                if (this.electronService.isElectron) {
                  if (!this.electronService.remote.getCurrentWindow().isFocused()) {
                    notification = new Notification(this.getTranslate('events_handler.main.notification_event_title'), {
                      body: this.getTranslate('events_handler.main.notification_event_from') + ' ' + checkNotify.createUser.name,
                      icon: 'assets/profileImg/' + checkNotify.createUser.email + '.jpg',
                      dir: 'auto',
                      data: this.loggedInUsers
                    });
                  }
                }
                const eventhandlerModel: EventHandlerEmailDate = {
                  email: this.loggedInUsers.email,
                  date: moment(new Date()).format('YYYY-MM-DD')
                };
                this.getEventsByEmail(eventhandlerModel, this.loggedInUsers);
              });
            }
          }

          if (this.electronService.isElectron) {
            if (!this.electronService.remote.getCurrentWindow().isFocused()) {
              this.notificationService.changeCurrentNotification(notification);

              this._subscription.add(
                this.notificationService.currentNotification.subscribe(notification => {
                  if (notification) {
                    notification.onclick = () => {
                      if (this.electronService.isElectron) {
                        this.electronService.remote.getCurrentWindow().show();
                      }
                    };

                    notification.onclose = () => {
                      //this.decline_call();
                    };
                  }
                })
              );
            }
          }
        });

        this.stompClient.subscribe('/actionEvent', (message) => {
          // console.log("actionCalendar" , message);
        });
        this.stompClient.subscribe('/actionReminder', (message) => {
          // console.log("actionReminder" , message);
        });
      }, (error) => {
        // console.log(error);
        reject();
        this.errorCallBack(error);
      });
    });
  }

  getTranslate(word: string): string {
    return this.translateService.instant(word);
  }

  errorCallBack(e) {
    // setTimeout(() => this.initializeWebSocketConnection(), 200);
  }

  sendMessage(message) {
    this.stompClient.send('/app/autoComplete', {}, JSON.stringify(message));
  }

  sendMessageSearchAll(message) {
    console.log('send: ', message);
    this.stompClient.send('/app/search', {}, JSON.stringify(message));
  }
}
