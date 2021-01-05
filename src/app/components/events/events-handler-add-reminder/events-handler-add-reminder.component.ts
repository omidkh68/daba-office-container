import {Component, Inject, OnDestroy, OnInit,} from '@angular/core';
import {hours} from '../../../shared/utils';
import * as moment from 'moment';
import * as jalaliMoment from 'jalali-moment';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from '../../message/service/message.service';
import {EventApiService} from '../logic/api.service';
import {DatetimeService} from '../../dashboard/dashboard-toolbar/time-area/service/datetime.service';
import {TranslateService} from '@ngx-translate/core';
import {EventHandlerService} from '../service/event-handler.service';
import {EventHandlerInterface} from '../logic/event-handler.interface';
import {ReminderTypeInterface} from '../logic/event-reminder.interface';
import {IDatePickerDirectiveConfig} from 'ng2-jalali-date-picker';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-events-handler-add-reminder',
  templateUrl: './events-handler-add-reminder.component.html'
})
export class EventsHandlerAddReminderComponent implements OnInit, OnDestroy {
  rtlDirection: boolean;
  eventItems: EventHandlerInterface;
  reminderForm: FormGroup;
  editableReminder: boolean = false;
  reminderTypeList: ReminderTypeInterface[] = [];
  statusList: ReminderTypeInterface[] = [];
  hours = hours;
  datePicker: IDatePickerDirectiveConfig = null;

  private _subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              public dialog: MatDialog,
              private eventApi: EventApiService,
              private messageService: MessageService,
              public dateTimeService: DatetimeService,
              private translateService: TranslateService,
              private eventHandlerService: EventHandlerService,
              public dialogRef: MatDialogRef<EventsHandlerAddReminderComponent>) {
    this.rtlDirection = this.data.rtlDirection;
    this.eventItems = this.data.eventItems;
  }

  ngOnInit(): void {
    this._subscription.add(
      this.eventApi.getAllReminderType().subscribe((resp: any) => {
        if (resp.status == 200) {
          this.reminderTypeList = resp.content;
          this._subscription.add(
            this.eventApi.getAllStatusType().subscribe((result: any) => {
              if (result.status == 200) {
                this.statusList = result.content;
              }
            })
          );
        }
      })
    );
    this.createReminderForm().then(() => {
      this.editableReminder = true;
      this.reminderForm.enable();
      this.setupDatepickers();
    });
  }

  setupDatepickers() {
    this.datePicker = {
      locale: this.rtlDirection ? 'fa' : 'en',
      firstDayOfWeek: this.rtlDirection ? 'sa' : 'mo',
      format: this.rtlDirection ? 'YYYY/MM/DD' : 'YYYY/MM/DD',
      closeOnSelect: true,
      closeOnSelectDelay: 150
    };
  }

  selectCurrentTime() {
    const curDate = new Date();
    const curHour = curDate.getHours() < 10 ? '0' + curDate.getHours() : curDate.getHours();
    const curMinute = curDate.getMinutes();
    let selectedMinute = '';

    if (curMinute < 15) {
      selectedMinute = '00';
    } else if (curMinute >= 15 && curMinute < 30) {
      selectedMinute = '15';
    } else if (curMinute >= 30 && curMinute < 45) {
      selectedMinute = '15';
    } else if (curMinute >= 45) {
      selectedMinute = '45';
    }

    return curHour + ':' + selectedMinute;
  }

  createReminderForm() {
    return new Promise((resolve) => {

      let sdate = jalaliMoment.from(this.dateTimeService.formatDate(new Date()), 'en', 'YYYY-MM-DD').locale(this.rtlDirection ? 'fa' : 'en').format('YYYY/MM/DD');

      this.reminderForm = this.fb.group({
        reminderType: new FormControl(null, Validators.required),
        status: new FormControl(null, Validators.required),
        // endReminder: new FormControl('0000-00-00'),
        startReminder: new FormControl(sdate, Validators.required),
        startTime: new FormControl(this.selectCurrentTime(), Validators.required),
        endTime: new FormControl(this.selectCurrentTime(), Validators.required),
        description: new FormControl('', Validators.required)
      });
      resolve();
    });
  }

  submitReminder() {
    let formValue = {reminders: [this.reminderForm.value], id: this.data.eventItems.id};

    if (this.rtlDirection) {
      formValue.reminders[0].startReminder = jalaliMoment.from(formValue.reminders[0].startReminder, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY-MM-DD') + ' ' + formValue.reminders[0].startTime + ':00';
    } else {
      formValue.reminders[0].startReminder = moment(formValue.reminders[0].startReminder, 'YYYY/MM/DD').format('YYYY-MM-DD') + ' ' + formValue.reminders[0].startTime + ':00';
    }

    this._subscription.add(
      this.eventApi.addNewReminder(formValue).subscribe((resp: any) => {
        if (resp.result == 'successful') {
          this.messageService.showMessage(this.getTranslate('events_handler.form.add_reminder_successful'));
          this.dialogRef.close(true);
          this.eventHandlerService.moveEventItems(null);

        } else {
          this.messageService.showMessage(this.getTranslate('events_handler.form.add_reminder_error'));
        }
      })
    );
  }

  cancelReminderBtn() {
    this.dialogRef.close(true);
  }

  getTranslate(word) {
    return this.translateService.instant(word);
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
