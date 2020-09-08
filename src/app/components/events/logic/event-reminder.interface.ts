export interface ReminderTypeInterface {
    id?: number,
    description?: string,
    descriptionCode?: string
}

export interface ReminderInterface {
    id?: number;
    intervalTime?: number;
    description?: string;
    startReminder?: string;
    endReminder?: string;
    startdate_format?: string;
    enddate_format?: string;
    reminderType?: ReminderTypeInterface;
    status?: any;
    eventId?: number;
    reminderService?: any;
}
