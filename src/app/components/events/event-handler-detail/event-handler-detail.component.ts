import {Component, HostListener, Inject, Injector, OnDestroy, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/internal/Subscription';
import {LoginDataClass} from '../../../services/loginData.class';
import {MatDialog} from '@angular/material/dialog';
import {UserInfoService} from '../../users/services/user-info.service';
import {ApiService} from "../../users/logic/api.service";
import {EventApiService} from "../../events/logic/api.service";
import {EventHandlerBottomSheetInterface, EventHandlerDataInterface} from "../logic/event-handler-data.interface";
import {ViewDirectionService} from "../../../services/view-direction.service";
import {ActionTypeInterface, ActionTypeJobInterface, UserEventHandlerInterface} from "../logic/action-type.interface";
import {UserContainerInterface} from "../../users/logic/user-container.interface";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import * as moment from 'moment';
import {EventsHandlerAddReminderComponent} from "../events-handler-add-reminder/events-handler-add-reminder.component";
import {hours} from "../../../shared/utils";
import {MessageService} from "../../message/service/message.service";
import {EventHandlerService} from "../service/event-handler.service";
import {TranslateService} from "@ngx-translate/core";
import {EventHandlerInterface} from "../logic/event-handler.interface";
import {ReminderInterface} from "../logic/event-reminder.interface";
import {WindowManagerService} from "../../../services/window-manager.service";
import {ApproveComponent} from "../../approve/approve.component";

@Component({
    styleUrls: ['./event-handler-detail.component.scss'],
    templateUrl: './event-handler-detail.component.html'
})
export class EventHandlerDetailComponent extends LoginDataClass implements OnInit, OnDestroy {

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
        this.bottomSheetData.bottomSheetRef.close();
    }

    editable: boolean = false;
    form: FormGroup;
    rtlDirection: boolean;
    usersList: UserContainerInterface[] = [];
    usersListDone: UserEventHandlerInterface[] = [];
    actionTypeList: ActionTypeInterface[] = [];
    actionTypeJobList: ActionTypeJobInterface[] = [];
    bottomSheetData: EventHandlerBottomSheetInterface;
    data: EventHandlerDataInterface;
    hours = hours;
    private _subscription: Subscription = new Subscription();

    constructor(private api: ApiService,
                public dialog: MatDialog,
                private eventApi: EventApiService,
                private fb: FormBuilder,
                private viewDirection: ViewDirectionService,
                private eventHandlerService: EventHandlerService,
                private injector: Injector,
                private translateService: TranslateService,
                private messageService: MessageService,
                private windowManagerService: WindowManagerService,
                private userInfoService: UserInfoService) {

        super(injector, userInfoService);
        this._subscription.add(
            this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
        );
        this._subscription.add(
            this.eventHandlerService.currentEventItems.subscribe(eventItems => {
                if (eventItems == null && this.bottomSheetData) {
                    this.bottomSheetData.bottomSheetRef.close();
                    this.refreshEvents();
                }
            })
        );
    }

    ngOnInit(): void {
        this.data = this.bottomSheetData.data;
        this.createForm().then(() => {
            if (this.data.eventItems) {
                this.editable = false;
                this.form.disable();
            } else {
                this.form.enable();
                this.editable = true;
            }
        });

        this._subscription.add(
            this.api.getHRUsers().subscribe((resp: any) => {
                if (resp.success) {
                    this.usersList = resp.data;
                    this.form.patchValue({
                        users: this.data.eventItems ? this.data.eventItems.users : []
                    });
                    if (this.data.eventItems) {
                        if (this.data.eventItems.users.length) {
                            let cars1IDs = new Set(this.data.eventItems.users.map(({email}) => email));
                            this.usersList = this.usersList.filter(({email}) => !cars1IDs.has(email));
                        }
                    }
                }
            })
        );

        this._subscription.add(
            this.eventApi.getAllActionType().subscribe((resp: any) => {
                if (resp.status == 200) {
                    this.actionTypeList = resp.content;
                    if (this.data.eventItems) {
                        this.actionTypeJobList = this.data.eventItems.actionType.actionTypeJobModels;
                        const item = this.actionTypeList.filter((item: ActionTypeInterface) => item.id === this.data.eventItems.actionType.id).pop();
                        this.form.patchValue({
                            actionType: item
                        });
                        if (this.data.eventItems.actionTypeJobModel) {
                            const item = this.actionTypeJobList.filter((item: ActionTypeInterface) => item.id === this.data.eventItems.actionTypeJobModel?.id).pop();
                            this.form.patchValue({
                                actionTypeJobModel: item
                            });
                        }
                    }
                }
            })
        );
    }

    drop(event: CdkDragDrop<UserContainerInterface[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
    }

    transferToRight(user: UserContainerInterface) {
        this.form.patchValue({
            users: [...this.form.get("users").value, user]
        });
        this.usersList = this.usersList.filter(obj => obj !== user);
    }

    transferToLeft(user: UserContainerInterface) {
        this.usersList.push(user);
        this.form.patchValue({
            users: this.form.get("users").value.filter(obj => obj !== user)
        });
    }

    editUser(user: UserEventHandlerInterface, $event, type: string = '') {
        $event.stopPropagation();
        user.editable = type == 'close' || type == 'submit' ? false : true;
        user.phoneNumber = type == 'submit' && user.phoneNumberTemp ? user.phoneNumberTemp : user.phoneNumber;
    }

    onKeyPhoneNumber(user: UserEventHandlerInterface, $event) {
        user.phoneNumberTemp = $event.target.value;
    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    enableForm() {
        this.form.enable();
        this.editable = true;
    }

    deleteReminder(event, reminder) {
        event.stopPropagation();
        this.form.disable();
        this.editable = false;
        const dialogRef = this.dialog.open(ApproveComponent, {
            data: {
                title: this.getTranslate('events_handler.reminder_detail.delete_title'),
                message: this.getTranslate('events_handler.reminder_detail.delete_text')
            },
            autoFocus: false,
            width: '70vh',
            maxWidth: '350px',
            panelClass: 'approve-detail-dialog',
            height: '160px'
        });
        this.windowManagerService.dialogOnTop(dialogRef.id);
        this._subscription.add(
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.eventApi.deleteReminderById(reminder.id).subscribe((result: any) => {
                        if (result.status == 200) {
                            if (result.result == "successful") {
                                this.refreshEvents();
                                this.bottomSheetData.bottomSheetRef.close();
                                this.messageService.showMessage(this.getTranslate('events_handler.form.add_reminder_successful'));
                            } else {
                                this.messageService.showMessage(this.getTranslate('events_handler.form.delete_reminder_successful'));
                            }
                        } else {
                            this.messageService.showMessage(this.getTranslate('events_handler.form.delete_reminder_successful'));
                        }
                    })
                }
            })
        );
    }

    deleteEvent() {
        this.form.disable();
        this.editable = false;
        const dialogRef = this.dialog.open(ApproveComponent, {
            data: {
                title: this.getTranslate('events_handler.event_detail.delete_title'),
                message: this.getTranslate('events_handler.event_detail.delete_text')
            },
            autoFocus: false,
            width: '70vh',
            maxWidth: '350px',
            panelClass: 'approve-detail-dialog',
            height: '160px'
        });

        this.windowManagerService.dialogOnTop(dialogRef.id);
        this._subscription.add(
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.eventApi.deleteEventById(this.data.eventItems.id).subscribe((result: any) => {
                        if (result.status == 200) {
                            if (result.result == "successful") {
                                this.refreshEvents();
                                this.bottomSheetData.bottomSheetRef.close();
                                this.messageService.showMessage(this.getTranslate('events_handler.form.delete_event_successful'));
                            } else {
                                this.messageService.showMessage(this.getTranslate('events_handler.form.delete_event_error'));
                            }
                        } else {
                            this.messageService.showMessage(this.getTranslate('events_handler.form.delete_event_error'));
                        }
                    })
                }
            })
        );
    }

    onChangeAction(event) {
        if (event.value.actionTypeJobModels.length)
            this.actionTypeJobList = event.value.actionTypeJobModels;
        else {
            this.actionTypeJobList = [];
            this.form.get("actionTypeJobModel").setValue([])
        }

    }

    submit() {
        let formValue = this.form.value;
        formValue.creatorUser = this.loggedInUser;
        formValue.startDate = this.formatDate(this.form.value.startDate) + " " + this.form.value.startTime + ":00";
        formValue.endDate = this.formatDate(this.form.value.endDate) + " " + this.form.value.endTime + ":00";
/*        if (formValue.startDate > formValue.endDate) {
            this.form.controls['startDate'].setErrors({'incorrect': true});
            this.form.enable();
            return;
        }*/

        delete formValue.actionType.actionTypeJobModels;
        delete formValue.actionType.actionDescription;
        delete formValue.actionTypeJobModel.description;
        delete formValue.endDate;


        if (formValue.id) {
            this._subscription.add(
                this.eventApi.deleteEventById(formValue.id).subscribe((resp: any) => {
                    if (resp.result == "successful") {
                        this.addNewEvent(formValue, true);
                    } else {
                        this.messageService.showMessage(this.getTranslate('events_handler.form.update_event_error'));
                    }
                })
            );
        } else {
            this.addNewEvent(formValue);
        }
    }

    addNewEvent(formValue, isUpdate: boolean = false) {
        this._subscription.add(
            this.eventApi.addNewEvent(formValue).subscribe((resp: any) => {
                if (resp.result == "successful") {
                    let msg = isUpdate ? this.getTranslate('events_handler.form.update_event_successful')
                        : this.getTranslate('events_handler.form.add_event_successful');
                    this.messageService.showMessage(msg);
                    this.refreshEvents();
                } else {
                    this.messageService.showMessage(this.getTranslate('events_handler.form.delete_event_error'));
                }
            })
        );
    }

    cancelBtn(event) {
        this.form.disable();
        this.editable = false;

        if (event) {
            if (this.data.action === 'detail') {
                if (this.editable) {
                } else {
                    this.bottomSheetData.bottomSheetRef.close();
                }
            } else {
                this.bottomSheetData.bottomSheetRef.close();
            }
        }
    }

    refreshEvents() {
        this.eventApi.getEventByEmail(this.loggedInUser.email).subscribe((result: any) => {
            let events = [];
            if (result.status == 200) {
                if (result.contents.length) {
                    result.contents.map((item: EventHandlerInterface) => {
                        item.sTime = new Date(item.startDate).toLocaleTimeString();
                        item.eTime = new Date(item.endDate).toLocaleTimeString();
                        item.reminders.map((item: ReminderInterface) => {
                            item.startdate_format = new Date(item.startReminder).toLocaleDateString();
                            item.enddate_format = new Date(item.endReminder).toLocaleDateString();
                        })
                    });
                    events = result.contents;
                }
            }
            this.eventHandlerService.moveEvents(events);
            this.bottomSheetData.bottomSheetRef.close();
        })
    }

    createForm() {
        return new Promise((resolve) => {
            this.form = this.fb.group({
                users: new FormControl(this.data.eventItems ? this.data.eventItems.users : []),
                id: new FormControl(this.data.eventItems ? this.data.eventItems.id : 0),
                name: new FormControl(this.data.eventItems ? this.data.eventItems.name : '', Validators.required),
                startDate: new FormControl(this.data.eventItems ? new Date(this.data.eventItems?.startDate).toLocaleDateString() : this.data.currentDate.toLocaleDateString(), Validators.required),
                startTime: new FormControl(this.data.eventItems ? this.data.eventItems?.sTime : '00:00', Validators.required),
                endDate: new FormControl(this.data.eventItems ? new Date(this.data.eventItems?.endDate).toLocaleDateString() : this.data.currentDate.toLocaleDateString(), Validators.required),
                endTime: new FormControl(this.data.eventItems ? this.data.eventItems?.eTime : '00:00', Validators.required),
                description: new FormControl(this.data.eventItems ? this.data.eventItems.description : '', Validators.required),
                actionType: new FormControl(this.data.eventItems ? this.data.eventItems.actionType : [], Validators.required),
                actionTypeJobModel: new FormControl(this.data.eventItems ? this.data.eventItems.actionTypeJobModel : [], Validators.required),
            });

            resolve(true);
        });
    }

    dateToGregorian(type: string, event: MatDatepickerInputEvent<Date>) {
        this.form.get(type).setValue(moment(event.value['_d']).format('YYYY-MM-DD'));
    }

    openAddReminderDialog() {
        let data: any = {
            action: 'add',
            eventItems: this.data.eventItems,
            rtlDirection: this.rtlDirection,

        };
        const dialogRef = this.dialog.open(EventsHandlerAddReminderComponent, {
            data: data,
            autoFocus: false,
            width: '30%',
            height: '330px'
        });
        this.windowManagerService.dialogOnTop(dialogRef.id);
    }

    getTranslate(word) {
        return this.translateService.instant(word);
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }
}
