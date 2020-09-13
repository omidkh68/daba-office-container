import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {AppConfig} from "../../../../environments/environment";
import {ActionTypeInterface} from "./action-type.interface";
import {AddReminderInterface, EventHandlerInterface} from "./event-handler.interface";
import {ReminderInterface, ReminderTypeInterface} from "./event-reminder.interface";

@Injectable({
    providedIn: 'root'
})
export class EventApiService {
    public accessToken = '';
    private API_URL = AppConfig.EVENT_HANDLER_URL;

    /**
     * @type {HttpHeaders}
     */
    private headers = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; charset=UTF-8'
        })
    };

    constructor(private http: HttpClient) {
    }

    getAllActionType(): Observable<ActionTypeInterface[]> {
        return this.http.get<ActionTypeInterface[]>(`${this.API_URL}/actionType/getAllActionType`);
    }

    addNewEvent(event: EventHandlerInterface): Observable<EventHandlerInterface> {
        return this.http.post<EventHandlerInterface>(`${this.API_URL}/AddEvent`, event);
    }

    addNewReminder(event: AddReminderInterface): Observable<AddReminderInterface> {
        return this.http.post<AddReminderInterface>(`${this.API_URL}/reminder/AddReminder`, event);
    }

    getAllReminderType(): Observable<ReminderTypeInterface> {
        return this.http.get<ReminderTypeInterface>(`${this.API_URL}/reminderType/getAllReminderType`);
    }

    getAllStatusType(): Observable<ReminderInterface> {
        return this.http.get<ReminderInterface>(`${this.API_URL}/statusReminderType/getAllStatusType`);
    }

    getEventByEmail(email: string): Observable<EventHandlerInterface> {
        return this.http.post<EventHandlerInterface>(`${this.API_URL}/getEventByEmail/?email=${email}`, null);
    }

    deleteEventById(id: number): Observable<any> {
        return this.http.delete<any>(`${this.API_URL}/deleteEvent/?id=${id}`, this.headers);
    }

    deleteReminderById(id: number): Observable<any> {
        return this.http.delete<any>(`${this.API_URL}/reminder/deleteReminder/?id=${id}`, this.headers);
    }
}
