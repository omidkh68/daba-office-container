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
import {MessageService} from "../../../services/message.service";

@Component({
    selector: 'app-events-handler-add-reminder',
    templateUrl: './events-handler-add-reminder.component.html'
})
export class EventsHandlerAddReminderComponent implements OnInit {

    rtlDirection: boolean;
    eventItems: EventHandlerInterface;
    reminderForm: FormGroup;
    editableReminder: boolean = false;
    private _subscription: Subscription = new Subscription();
    reminderTypeList: ReminderTypeInterface[] = [];
    statusList: ReminderTypeInterface[] = [];
    hours = hours;

    constructor(private fb: FormBuilder,
                public dialog: MatDialog,
                private messageService: MessageService,
                public dialogRef: MatDialogRef<EventsHandlerAddReminderComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private eventApi : EventApiService) {
        this.rtlDirection = this.data.rtlDirection;
        this.eventItems = this.data.eventItems;
    }

    ngOnInit(): void {

        this._subscription.add(
            this.eventApi.getAllReminderType().subscribe((resp: any) => {
                if (resp.status == 200) {
                    this.reminderTypeList = resp.content;
                }
            })
        );

        this._subscription.add(
            this.eventApi.getAllStatusType().subscribe((resp: any) => {
                if (resp.status == 200) {
                    this.statusList = resp.content;
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
        debugger;
        let formValue = {reminders : [this.reminderForm.value] , id: this.data.eventItems.id} ;

        formValue.reminders[0].startReminder = formValue.reminders[0].startReminder + " " + formValue.reminders[0].startTime + ":00";
        formValue.reminders[0].endReminder = formValue.reminders[0].endReminder + " " + formValue.reminders[0].endTime + ":00";
        if(formValue.reminders[0].startReminder > formValue.reminders[0].endReminder){
            return;
        }
        this._subscription.add(
            this.eventApi.addNewReminder(formValue).subscribe((resp: any) => {
                this.messageService.showMessage(resp.result);
                this.dialogRef.close(true);
            })
        );
    }

    cancelReminderBtn() {
        this.dialogRef.close(true);
    }

    dateToGregorianReminder(type: string, event: MatDatepickerInputEvent<Date>) {
        this.reminderForm.get(type).setValue(moment(event.value['_d']).format('YYYY-MM-DD'));
    }


    ngAfterViewInit(): void {

    }

}
