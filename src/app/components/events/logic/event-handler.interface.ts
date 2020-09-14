import {ActionTypeInterface, ActionTypeJobInterface, UserEventHandlerInterface} from "./action-type.interface";
import {ReminderInterface} from "./event-reminder.interface";

export interface EventHandlerInterface {
    actionType: ActionTypeInterface;
    id?: number;
    actionTypeJobModel: ActionTypeJobInterface;
    description: string;
    endDate: string;
    eTime?: string;
    name: string;
    startDate: string;
    sTime?: string;
    reminders?: ReminderInterface[];
    users: UserEventHandlerInterface[];
}

export interface AddReminderInterface {
    id?: number;
    reminders?: ReminderInterface[];
}