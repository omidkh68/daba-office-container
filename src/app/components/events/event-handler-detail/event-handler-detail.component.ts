import {Component, HostListener, Injector, OnDestroy, OnInit} from '@angular/core';
import {hours} from '../../../shared/utils';
import * as moment from 'moment';
import * as jalaliMoment from 'jalali-moment';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../../users/logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {SelectionModel} from '@angular/cdk/collections';
import {LoginDataClass} from '../../../services/loginData.class';
import {MessageService} from '../../message/service/message.service';
import {EventApiService} from '../logic/api.service';
import {UserInfoService} from '../../users/services/user-info.service';
import {DatetimeService} from '../../dashboard/dashboard-toolbar/time-area/service/datetime.service';
import {ApproveComponent} from '../../approve/approve.component';
import {TranslateService} from '@ngx-translate/core';
import {MatTableDataSource} from '@angular/material/table';
import {EventHandlerService} from '../service/event-handler.service';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {WindowManagerService} from '../../../services/window-manager.service';
import {EventHandlerSocketService} from '../service/event-handler-socket.service';
import {IDatePickerDirectiveConfig} from 'ng2-jalali-date-picker';
import {EventsHandlerAddReminderComponent} from '../events-handler-add-reminder/events-handler-add-reminder.component';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {ResultSubsetUsersInterface, UserContainerInterface} from '../../users/logic/user-container.interface';
import {EventHandlerBottomSheetInterface, EventHandlerDataInterface} from '../logic/event-handler-data.interface';
import {ActionTypeInterface, ActionTypeJobInterface, UserEventHandlerInterface} from '../logic/action-type.interface';

@Component({
  styleUrls: ['./event-handler-detail.component.scss'],
  templateUrl: './event-handler-detail.component.html'
})
export class EventHandlerDetailComponent extends LoginDataClass implements OnInit, OnDestroy {
  editable = false;
  form: FormGroup;
  rtlDirection = false;
  usersList: Array<UserContainerInterface> = [];
  displayedColumns: string[] = ['select', 'name', 'symbol'];
  dataSource = null;
  selection = new SelectionModel<UserContainerInterface>(true, []);
  actionTypeList: Array<ActionTypeInterface> = [];
  actionTypeJobList: Array<ActionTypeJobInterface> = [];
  bottomSheetData: EventHandlerBottomSheetInterface;
  data: EventHandlerDataInterface;
  hours = hours;
  socket = null;
  datePicker: IDatePickerDirectiveConfig = null;
  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              public dateTimeService: DatetimeService,
              private api: ApiService,
              private fb: FormBuilder,
              private injector: Injector,
              private eventApi: EventApiService,
              private messageService: MessageService,
              private userInfoService: UserInfoService,
              private translateService: TranslateService,
              private viewDirection: ViewDirectionService,
              private eventHandlerService: EventHandlerService,
              private windowManagerService: WindowManagerService,
              private eventHandlerSocketService: EventHandlerSocketService) {
    super(injector, userInfoService);
    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => {
        this.rtlDirection = direction;
        this.setupDatepickers();
      })
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

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
    this.bottomSheetData.bottomSheetRef.close();
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
      this.api.getHRUsers().subscribe((resp: ResultSubsetUsersInterface) => {
        if (resp.success) {
          this.usersList = resp.data;
          this.dataSource = new MatTableDataSource<UserContainerInterface>(this.usersList);
          if (this.data.eventItems) {
            if (this.data.eventItems.users) {
              this.dataSource.data.forEach(row => {
                this.data.eventItems.users.forEach(row_2 => {
                  if (row_2.email == row.email) {
                    row.phoneNumber = row_2.phoneNumber;
                    this.selection.select(row);
                  }
                });

              });
            }
          }
          this.form.patchValue({
            users: this.data.eventItems ? this.data.eventItems.users : []
          });
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

  setupDatepickers() {
    this.datePicker = {
      locale: this.rtlDirection ? 'fa' : 'en',
      firstDayOfWeek: this.rtlDirection ? 'sa' : 'mo',
      format: this.rtlDirection ? 'YYYY/MM/DD' : 'YYYY/MM/DD',
      closeOnSelect: true,
      closeOnSelectDelay: 150
    };
  }

  drop(event: CdkDragDrop<Array<UserContainerInterface>>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  filterMatTable($event) {
    this.dataSource.filter = $event.target.value;
  }

  transferToRight(user: UserContainerInterface) {
    this.form.patchValue({
      users: [...this.form.get('users').value, user]
    });
    this.usersList = this.usersList.filter(obj => obj !== user);
  }

  transferToLeft(user: UserContainerInterface) {
    this.usersList.push(user);
    this.form.patchValue({
      users: this.form.get('users').value.filter(obj => obj !== user)
    });
  }

  editUser(user: UserEventHandlerInterface, $event, type = '') {
    $event.stopPropagation();
    user.editable = !(type == 'close' || type == 'submit');
    user.phoneNumber = type == 'submit' && user.phoneNumberTemp ? user.phoneNumberTemp : user.phoneNumber;
  }

  onKeyPhoneNumber(user: UserEventHandlerInterface, $event: KeyboardEvent) {
    user.phoneNumber = ($event.target as HTMLInputElement).value;
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

    this._subscription.add(
      dialogRef.afterOpened().subscribe(() => {
        this.windowManagerService.dialogOnTop(dialogRef.id);
      })
    );

    this._subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.eventApi.deleteReminderById(reminder.id).subscribe((result: any) => {
            if (result.status == 200) {
              if (result.result == 'successful') {
                this.refreshEvents();
                this.bottomSheetData.bottomSheetRef.close();
                this.messageService.showMessage(this.getTranslate('events_handler.form.add_reminder_successful'));
              } else {
                this.messageService.showMessage(this.getTranslate('events_handler.form.delete_reminder_successful'));
              }
            } else {
              this.messageService.showMessage(this.getTranslate('events_handler.form.delete_reminder_successful'));
            }
          });
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

    this._subscription.add(
      dialogRef.afterOpened().subscribe(() => {
        this.windowManagerService.dialogOnTop(dialogRef.id);
      })
    );

    this._subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.eventApi.deleteEventById(this.data.eventItems.id).subscribe((result: any) => {
            if (result.status == 200) {
              if (result.result == 'successful') {
                this.refreshEvents();
                this.bottomSheetData.bottomSheetRef.close();
                this.messageService.showMessage(this.getTranslate('events_handler.form.delete_event_successful'));
              } else {
                this.messageService.showMessage(this.getTranslate('events_handler.form.delete_event_error'));
              }
            } else {
              this.messageService.showMessage(this.getTranslate('events_handler.form.delete_event_error'));
            }
          });
        }
      })
    );
  }

  onChangeAction(event) {
    if (event.value.actionTypeJobModels.length)
      this.actionTypeJobList = event.value.actionTypeJobModels;
    else {
      this.actionTypeJobList = [];
      this.form.get('actionTypeJobModel').setValue([]);
    }

  }

  submit() {
    const formValue = {...this.form.value};
    formValue.creatorUser = this.loggedInUser;
    if (this.rtlDirection) {
      formValue.startDate = jalaliMoment.from(this.form.value.startDate, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY-MM-DD') + ' ' + this.form.value.startTime + ':00';
    } else {
      formValue.startDate = moment(this.form.value.startDate, 'YYYY/MM/DD').format('YYYY-MM-DD') + ' ' + this.form.value.startTime + ':00';
    }

    formValue.users = this.selection.selected;
    delete formValue.actionType.actionTypeJobModels;
    delete formValue.actionType.actionDescription;
    delete formValue.actionTypeJobModel.description;
    delete formValue.endDate;


    if (formValue.id) {
      this._subscription.add(
        this.eventApi.deleteEventById(formValue.id).subscribe((resp: any) => {
          if (resp.result == 'successful') {
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

  addNewEvent(formValue, isUpdate = false) {
    this._subscription.add(
      this.eventApi.addNewEvent(formValue).subscribe((resp: any) => {
        if (resp.result == 'successful') {
          const msg = isUpdate ? this.getTranslate('events_handler.form.update_event_successful')
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
    /*    this.eventHandlerSocketService.getEventsByEmail(this.loggedInUser).then((result: any) => {
          this._subscription.add();
          this.bottomSheetData.bottomSheetRef.close();
        })*/
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

  createForm() {
    return new Promise((resolve) => {
      const sdateFinal = this.data.eventItems ? new Date(this.data.eventItems?.startDate) : this.data.currentDate;
      const edateFinal = this.data.eventItems ? new Date(this.data.eventItems?.endDate) : this.data.currentDate;

      const sdate = jalaliMoment.from(this.dateTimeService.formatDate(sdateFinal), 'en', 'YYYY-MM-DD').locale(this.rtlDirection ? 'fa' : 'en').format('YYYY/MM/DD');
      const edate = jalaliMoment.from(this.dateTimeService.formatDate(edateFinal), 'en', 'YYYY-MM-DD').locale(this.rtlDirection ? 'fa' : 'en').format('YYYY/MM/DD');


      const stime = this.data.eventItems ? this.dateTimeService.formatTime(this.data.eventItems?.startDate) : this.selectCurrentTime();
      const etime = this.data.eventItems ? this.dateTimeService.formatTime(this.data.eventItems?.endDate) : this.selectCurrentTime();

      this.form = this.fb.group({
        users: new FormControl(this.data.eventItems ? this.data.eventItems.users : []),
        id: new FormControl(this.data.eventItems ? this.data.eventItems.id : 0),
        name: new FormControl(this.data.eventItems ? this.data.eventItems.name : '', Validators.required),
        startDate: new FormControl(sdate, Validators.required),
        startTime: new FormControl(stime, Validators.required),
        endDate: new FormControl(edate, Validators.required),
        endTime: new FormControl(etime, Validators.required),
        description: new FormControl(this.data.eventItems ? this.data.eventItems.description : '', Validators.required),
        actionType: new FormControl(this.data.eventItems ? this.data.eventItems.actionType : [], Validators.required),
        actionTypeJobModel: new FormControl(this.data.eventItems ? this.data.eventItems.actionTypeJobModel : [], Validators.required),
      });

      resolve(true);
    });
  }

  openAddReminderDialog() {
    const data: any = {
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

    this._subscription.add(
      dialogRef.afterOpened().subscribe(() => {
        this.windowManagerService.dialogOnTop(dialogRef.id);
      })
    );
  }

  getTranslate(word: string): string {
    return this.translateService.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
