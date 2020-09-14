import {ComponentFactory, ComponentFactoryResolver, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {FullCalendarModule} from '@fullcalendar/angular';
import {EventsHandlerComponent} from './events-handler.component';
import {EventsHandlerMainComponent} from './events-handler-main/events-handler-main.component';
import {EventsHandlerWindowComponent} from './events-handler-window/events-handler-window.component';
import {EventHandlerDetailComponent} from './event-handler-detail/event-handler-detail.component';
import {A11yModule} from '@angular/cdk/a11y';
import {EventsHandlerAddReminderComponent} from './events-handler-add-reminder/events-handler-add-reminder.component';
import {EventHandlerBottomSheetComponent} from './event-handler-bottom-sheet/event-handler-bottom-sheet.component';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {JalaliMomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '../../shared/jalali-moment-date-adapter';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {JALALI_MOMENT_FORMATS, MOMENT_FORMATS} from '../../shared/jalali_moment_formats';

const defaultLangStorage = localStorage.getItem('defaultLang');
const defaultLang = defaultLangStorage !== null && defaultLangStorage === 'fa' ? 'fa' : 'en-GB';

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
    FullCalendarModule,
    TranslateModule.forChild({}),
    A11yModule
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: defaultLang === 'fa' ? JalaliMomentDateAdapter : MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    {provide: MAT_DATE_LOCALE, useValue: defaultLang === 'fa' ? defaultLang : 'en-GB'}, // en-GB  fr
    {
      provide: MAT_DATE_FORMATS,
      useFactory: locale => {
        if (locale === (defaultLang === 'fa')) {
          return JALALI_MOMENT_FORMATS;
        } else {
          return MOMENT_FORMATS;
        }
      },
      deps: [MAT_DATE_LOCALE],
      // useValue: JALALI_MOMENT_FORMATS
    },
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}
  ]
})
export class EventsHandlerModule {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  public resolveComponent(): ComponentFactory<EventsHandlerWindowComponent> {
    return this.componentFactoryResolver.resolveComponentFactory(EventsHandlerWindowComponent);
  }
}
