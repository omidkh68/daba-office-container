import {UserInterface} from "../../users/logic/user-interface";
import {EventHandlerInterface} from "./event-handler.interface";
import {ReminderInterface} from "./event-reminder.interface";
import {Type} from "@angular/core";
import {TaskDataInterface} from "../../tasks/logic/task-data-interface";

export interface EventHandlerDataInterface {
    action?: string;
    eventItems?: EventHandlerInterface;
}

export interface EventHandlerBottomSheetInterface {
    bottomSheetRef?;
    component: Type<any>;
    height: string;
    width: string;
    data?: EventHandlerDataInterface;
}
