import {ComponentFactory, ComponentFactoryResolver, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {FilePickerModule} from 'ngx-awesome-uploader';
import {EventsHandlerWindowComponent} from "./events-handler-window/events-handler-window.component";
import {EventsHandlerComponent} from "./events-handler.component";
import {EventsHandlerMainComponent} from "./events-handler-main/events-handler-main.component";
import {FullCalendarModule} from "@fullcalendar/angular";
import {A11yModule} from "@angular/cdk/a11y";

@NgModule({
    declarations: [
        EventsHandlerWindowComponent,
        EventsHandlerComponent,
        EventsHandlerMainComponent
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
