import {Component, HostListener, Injector, OnDestroy, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/internal/Subscription';
import {LoginDataClass} from '../../../services/loginData.class';
import {MatDialog} from '@angular/material/dialog';
import {UserInfoService} from '../../users/services/user-info.service';
import {ApiService} from '../../users/logic/api.service';
import {EventApiService} from '../../events/logic/api.service';
import {EventHandlerBottomSheetInterface, EventHandlerDataInterface} from '../logic/event-handler-data.interface';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {ActionTypeInterface, ActionTypeJobInterface, UserEventHandlerInterface} from '../logic/action-type.interface';
import {UserContainerInterface} from '../../users/logic/user-container.interface';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import * as moment from 'moment';
import {EventsHandlerAddReminderComponent} from '../events-handler-add-reminder/events-handler-add-reminder.component';
import {hours} from '../../../shared/utils';
import {MessageService} from '../../message/service/message.service';
import {EventHandlerService} from '../service/event-handler.service';
import {TranslateService} from '@ngx-translate/core';
import {WindowManagerService} from '../../../services/window-manager.service';
import {ApproveComponent} from '../../approve/approve.component';
import {EventHandlerSocketService} from '../service/event-handler-socket.service';
import {DatetimeService} from '../../dashboard/dashboard-toolbar/time-area/service/datetime.service';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  styleUrls: ['./event-handler-detail.component.scss'],
  templateUrl: './event-handler-detail.component.html'
})
export class EventHandlerDetailComponent extends LoginDataClass implements OnInit, OnDestroy {

  editable: boolean = false;
  form: FormGroup;
  rtlDirection: boolean;
  usersList: UserContainerInterface[] = [];
  displayedColumns: string[] = ['select', 'name', 'symbol'];
  dataSource = null;
  selection = new SelectionModel<UserContainerInterface>(true, []);
  actionTypeList: ActionTypeInterface[] = [];
  actionTypeJobList: ActionTypeJobInterface[] = [];
  bottomSheetData: EventHandlerBottomSheetInterface;
  data: EventHandlerDataInterface;
  hours = hours;
  socket = null;
  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              public dateTimeService: DatetimeService,
              private api: ApiService,
              private eventApi: EventApiService,
              private fb: FormBuilder,
              private viewDirection: ViewDirectionService,
              private eventHandlerService: EventHandlerService,
              private injector: Injector,
              private eventHandlerSocketService: EventHandlerSocketService,
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
      this.api.getHRUsers().subscribe((resp: any) => {
        if (resp.success) {
          this.usersList = resp.data;
          this.dataSource = new MatTableDataSource<UserContainerInterface>(this.usersList);
          if (this.data.eventItems) {
            if (this.data.eventItems.users) {
              this.dataSource.data.forEach(row => {
                this.data.eventItems.users.forEach(row_2 => {
                  if (row_2.email == row.email) {
                    row.phoneNumber = row_2.phoneNumber;
                    this.selection.select(row)
                  }
                })

              });
            }
          }
          this.form.patchValue({
            users: this.data.eventItems ? this.data.eventItems.users : []
          });
          /*                    if (this.data.eventItems) {
                                  if (this.data.eventItems.users.length) {
                                      let cars1IDs = new Set(this.data.eventItems.users.map(({email}) => email));
                                      this.usersList = this.usersList.filter(({email}) => !cars1IDs.has(email));
                                  }
                              }*/
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

  editUser(user: UserEventHandlerInterface, $event, type: string = '') {
    $event.stopPropagation();
    user.editable = type == 'close' || type == 'submit' ? false : true;
    user.phoneNumber = type == 'submit' && user.phoneNumberTemp ? user.phoneNumberTemp : user.phoneNumber;
  }

  onKeyPhoneNumber(user: UserEventHandlerInterface, $event) {
    user.phoneNumber = $event.target.value;
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
      this.form.get('actionTypeJobModel').setValue([])
    }

  }

  submit() {
    let formValue = this.form.value;
    formValue.creatorUser = this.loggedInUser;
    formValue.startDate = this.dateTimeService.convertToGMT(this.form.value.startDate, this.form.value.startTime);
    formValue.endDate = this.dateTimeService.convertToGMT(this.form.value.endDate, this.form.value.endTime);
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

  addNewEvent(formValue, isUpdate: boolean = false) {
    this._subscription.add(
      this.eventApi.addNewEvent(formValue).subscribe((resp: any) => {
        if (resp.result == 'successful') {
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

    const totalCurrentTime = curHour + ':' + selectedMinute;
    return totalCurrentTime;
  }

  createForm() {
    return new Promise((resolve) => {
      let sdate = this.data.eventItems ? this.dateTimeService.formatDate(this.data.eventItems?.startDate) : this.dateTimeService.formatDate(this.data.currentDate.toLocaleDateString());
      let edate = this.data.eventItems ? this.dateTimeService.formatDate(this.data.eventItems?.endDate) : this.dateTimeService.formatDate(this.data.currentDate.toLocaleDateString());
      let stime = this.data.eventItems ? this.dateTimeService.formatTime(this.data.eventItems?.startDate) : this.selectCurrentTime();
      let etime = this.data.eventItems ? this.dateTimeService.formatTime(this.data.eventItems?.endDate) : this.selectCurrentTime();

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
