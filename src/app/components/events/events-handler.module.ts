import {ComponentFactory, ComponentFactoryResolver, CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {EventsHandlerComponent} from './events-handler.component';
import {EventsHandlerMainComponent} from './events-handler-main/events-handler-main.component';
import {EventsHandlerWindowComponent} from './events-handler-window/events-handler-window.component';
import {EventHandlerDetailComponent} from './event-handler-detail/event-handler-detail.component';
import {A11yModule} from '@angular/cdk/a11y';
import {EventsHandlerAddReminderComponent} from './events-handler-add-reminder/events-handler-add-reminder.component';
import {EventHandlerBottomSheetComponent} from './event-handler-bottom-sheet/event-handler-bottom-sheet.component';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';

@NgModule({
  declarations: [
    EventsHandlerComponent,
    EventsHandlerMainComponent,
    EventHandlerDetailComponent,
    EventsHandlerWindowComponent,
    EventHandlerBottomSheetComponent,
    EventsHandlerAddReminderComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxChartsModule,
    DpDatePickerModule,
    TranslateModule.forChild({}),
    A11yModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EventsHandlerModule {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  public resolveComponent(): ComponentFactory<EventsHandlerWindowComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(EventsHandlerWindowComponent);
  }
}
