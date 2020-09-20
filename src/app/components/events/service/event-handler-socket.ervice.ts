import {Injectable} from '@angular/core';
import {AppConfig} from '../../../../environments/environment';
import {Subject} from 'rxjs/internal/Subject';
import {EventApiService} from "../logic/api.service";
import {EventHandlerService} from "./event-handler.service";
import {EventHandlerInterface} from "../logic/event-handler.interface";
import {ReminderInterface} from "../logic/event-reminder.interface";
import {Observable} from "rxjs";
import {UserContainerInterface} from "../../users/logic/user-container.interface";
import {DatetimeService} from "../../dashboard/dashboard-toolbar/time-area/service/datetime.service";

declare var SockJS;
declare var Stomp;

@Injectable({
    providedIn: 'root'
})
export class EventHandlerSocketService {
    public stompClient;
    public msg = new Subject();
    public connectedStatus: Subject<boolean> = new Subject();

    constructor(private eventApi: EventApiService ,
                private dateTimeservice: DatetimeService,
                private eventHandlerService: EventHandlerService) {
    }

    public getEventsByEmail(user: UserContainerInterface) {
        return new Promise((resolve, reject) => {
            this.eventApi.getEventByEmail(user.email).subscribe((resp: any) => {
                let events = [];
                let reminders = [];
                if (resp.status == 200) {
                    if (resp.contents) {
                        if (resp.contents.length) {
                            events = resp.contents;
                            events.map((item: EventHandlerInterface) => {
                                item.sTime = new Date(item.startDate).toLocaleTimeString();
                                item.eTime = new Date(item.endDate).toLocaleTimeString();
                                item.startDate = this.dateTimeservice.getDateByTimezone(item.startDate , user.timezone);
                                item.endDate = this.dateTimeservice.getDateByTimezone(item.endDate , user.timezone);

                                if (item.reminders.length)
                                    reminders = [...reminders, ...item.reminders]
                            });
                            reminders.map((item: ReminderInterface) => {
                                item.startdate_format = new Date(item.startReminder).toLocaleDateString();
                                item.enddate_format = new Date(item.endReminder).toLocaleDateString();
                                item.startReminder = this.dateTimeservice.getDateByTimezone(item.startReminder , user.timezone);
                                item.endReminder = this.dateTimeservice.getDateByTimezone(item.endReminder , user.timezone);
                            });
                            let data = {events : events , reminders: reminders};
                            this.eventHandlerService.moveEventsReminders(data);
                            resolve(data);
                        }
                    }else{
                        resolve({events : [] , reminders: []});
                    }
                }else{
                    resolve({events : [] , reminders: []});
                }
            })
        });
    }

    public initializeWebSocketConnection() {
        return new Promise((resolve, reject) => {
            const serverUrl = AppConfig.EVENT_HANDLER_WS;
            const ws = new SockJS(serverUrl);
            this.stompClient = Stomp.over(ws);
            this.stompClient.debug = () => {};
            this.stompClient.reconnect_delay = 2000;
            this.stompClient.connect({}, () => {
                resolve();
                this.connectedStatus.next(true);

                this.stompClient.subscribe('/user/msg', (message) => {
                    console.log(message);

/*                    if (message.body) {
                        console.log('receive: ', JSON.parse(message.body));

                        const result = JSON.parse(message.body);

                        // autocomplete && not exist
                        if (Array.isArray(result) && !result.length) {
                            this.msg.next([]);
                            // normal search
                        } else if (!Array.isArray(result) && !result.recordCount) {
                            this.msg.next([]);
                        } else {
                            this.msg.next(result);
                        }
                    }*/
                });
            }, (error) => {
                reject();
                this.errorCallBack(error);
            });
        });
    }

    errorCallBack(e) {
        setTimeout(() => this.initializeWebSocketConnection(), 200);
    }

    sendMessage(message) {
        this.stompClient.send('/app/autoComplete' , {}, JSON.stringify(message));
    }

    sendMessageSearchAll(message) {
        console.log('send: ', message);
        this.stompClient.send('/app/search' , {}, JSON.stringify(message));
    }
}
