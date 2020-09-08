import {ComponentFactory, ComponentFactoryResolver, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {FilePickerModule} from 'ngx-awesome-uploader';
import {FullCalendarModule} from "@fullcalendar/angular";
import {EventsHandlerComponent} from "./events-handler.component";
import {EventsHandlerMainComponent} from "./events-handler-main/events-handler-main.component";
import {EventsHandlerWindowComponent} from "./events-handler-window/events-handler-window.component";
import {EventHandlerDetailComponent} from "./event-handler-detail/event-handler-detail.component";
import {A11yModule} from "@angular/cdk/a11y";
import {TaskBottomSheetComponent} from "../tasks/task-bottom-sheet/task-bottom-sheet.component";
import {EventsHandlerAddReminderComponent} from "./events-handler-add-reminder/events-handler-add-reminder.component";

@NgModule({
    declarations: [
        EventsHandlerComponent,
        TaskBottomSheetComponent,
        EventsHandlerMainComponent,
        EventHandlerDetailComponent,
        EventsHandlerWindowComponent,
        EventsHandlerAddReminderComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        NgxChartsModule,
        FullCalendarModule,
        FilePickerModule,
        TranslateModule.forChild({}),
        A11yModule
    ]
})
export class EventsHandlerModule {
    constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    }

    public resolveComponent(): ComponentFactory<EventsHandlerWindowComponent> {
        return this.componentFactoryResolver.resolveComponentFactory(EventsHandlerWindowComponent);
    }
}
