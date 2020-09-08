import {ComponentFactory, ComponentFactoryResolver, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {FullCalendarModule} from "@fullcalendar/angular";
import {EventsHandlerComponent} from "./events-handler.component";
import {EventsHandlerMainComponent} from "./events-handler-main/events-handler-main.component";
import {EventsHandlerWindowComponent} from "./events-handler-window/events-handler-window.component";

@NgModule({
    declarations: [
        EventsHandlerComponent,
        EventsHandlerMainComponent,
        EventsHandlerWindowComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        NgxChartsModule,
        FullCalendarModule,
        TranslateModule.forChild({})
    ]
})
export class EventsHandlerModule {
    constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    }

    public resolveComponent(): ComponentFactory<EventsHandlerWindowComponent> {
        return this.componentFactoryResolver.resolveComponentFactory(EventsHandlerWindowComponent);
    }
}
