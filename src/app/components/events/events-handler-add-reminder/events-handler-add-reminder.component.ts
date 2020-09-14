import {
    Component, Inject,
    OnInit,
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {EventHandlerInterface} from "../logic/event-handler.interface";
import {Subscription} from "rxjs";
import {EventApiService} from "../logic/api.service";
import {ReminderTypeInterface} from "../logic/event-reminder.interface";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import * as moment from 'moment';
import {hours} from "../../../shared/utils";
import {MessageService} from "../../message/service/message.service";
import {TranslateService} from "@ngx-translate/core";
import {EventHandlerService} from "../service/event-handler.service";

@Component({
    selector: 'app-events-handler-add-reminder',
    templateUrl: './events-handler-add-reminder.component.html'
})
export class EventsHandlerAddReminderComponent implements OnInit {

    rtlDirection: boolean;
    eventItems: EventHandlerInterface;
    reminderForm: FormGroup;
    editableReminder: boolean = false;
    reminderTypeList: ReminderTypeInterface[] = [];
    statusList: ReminderTypeInterface[] = [];
    hours = hours;
    private _subscription: Subscription = new Subscription();

    constructor(private fb: FormBuilder,
                public dialog: MatDialog,
                private eventApi : EventApiService,
                private messageService: MessageService,
                private translateService: TranslateService,
                private eventHandlerService: EventHandlerService,
                public dialogRef: MatDialogRef<EventsHandlerAddReminderComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.rtlDirection = this.data.rtlDirection;
        this.eventItems = this.data.eventItems;
    }

    ngOnInit(): void {
        this._subscription.add(
            this.eventApi.getAllReminderType().subscribe((resp: any) => {
                debugger;
                if (resp.status == 200) {
                    this.reminderTypeList = resp.content;
                    this._subscription.add(
                        this.eventApi.getAllStatusType().subscribe((result: any) => {
                            debugger;
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
        });
    }

    createReminderForm() {
        return new Promise((resolve) => {
            this.reminderForm = this.fb.group({
                reminderType: new FormControl(null, Validators.required),
                status: new FormControl(null, Validators.required),
                endReminder: new FormControl('0000-00-00', Validators.required),
                startReminder: new FormControl('0000-00-00', Validators.required),
                startTime: new FormControl('00:00:00', Validators.required),
                endTime: new FormControl('00:00:00', Validators.required),
                description: new FormControl('', Validators.required)
            });
            resolve();
        });
    }

    submitReminder() {
        let formValue = {reminders : [this.reminderForm.value] , id: this.data.eventItems.id} ;
        formValue.reminders[0].startReminder = formValue.reminders[0].startReminder + " " + formValue.reminders[0].startTime + ":00";
        formValue.reminders[0].endReminder = formValue.reminders[0].endReminder + " " + formValue.reminders[0].endTime + ":00";
/*        if(formValue.reminders[0].startReminder > formValue.reminders[0].endReminder){
            this.reminderForm.controls['startReminder'].setErrors({'incorrect': true});
            this.reminderForm.enable();
            return;
        }*/
        delete formValue.reminders[0].endReminder;
        this._subscription.add(
            this.eventApi.addNewReminder(formValue).subscribe((resp: any) => {
                if(resp.result == "successful"){
                    this.messageService.showMessage(this.getTranslate('events_handler.form.add_reminder_successful'));
                    this.dialogRef.close(true);
                    this.eventHandlerService.moveEventItems(null);

                }else{
                    this.messageService.showMessage(this.getTranslate('events_handler.form.add_reminder_error'));
                }
            })
        );
    }

    cancelReminderBtn() {
        this.dialogRef.close(true);
    }

    dateToGregorianReminder(type: string, event: MatDatepickerInputEvent<Date>) {
        this.reminderForm.get(type).setValue(moment(event.value['_d']).format('YYYY-MM-DD'));
    }

    getTranslate(word) {
        return this.translateService.instant(word);
    }
}
