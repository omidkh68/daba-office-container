import {ActionTypeInterface, ActionTypeJobInterface, UserEventHandlerInterface} from "./action-type.interface";
import {ReminderInterface} from "./event-reminder.interface";
import {UserContainerInterface} from "../../users/logic/user-container.interface";

export interface EventHandlerInterface {
    actionType: ActionTypeInterface;
    id?: number;
    actionTypeJobModel: ActionTypeJobInterface;
    description: string;
    endDate: string;
    endDateDisplay: string;
    eTime?: string;
    name: string;
    startDate: string;
    startDateDisplay: string;
    creatorUser: UserEventHandlerInterface;
    sTime?: string;
    reminders?: ReminderInterface[];
    users: UserContainerInterface[];
}

export interface AddReminderInterface {
    id?: number;
    reminders?: ReminderInterface[];
}

export interface EventsReminderInterface {
    events: EventHandlerInterface[];
    reminders:  ReminderInterface[];
}
