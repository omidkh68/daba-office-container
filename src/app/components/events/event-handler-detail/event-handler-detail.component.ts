import {Component, Inject, Injector, OnDestroy, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/internal/Subscription';
import {LoginDataClass} from '../../../services/loginData.class';
import {MessageService} from '../../../services/message.service';
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

@Component({
  styleUrls: ['./event-handler-detail.component.scss'],
  templateUrl: './event-handler-detail.component.html'
})
export class EventHandlerDetailComponent extends LoginDataClass implements OnInit,OnDestroy{
  editable: boolean = false;
  editableReminder: boolean = false;
  form: FormGroup;
  reminderForm: FormGroup;
  rtlDirection: boolean;
  private _subscription: Subscription = new Subscription();
  usersList: UserContainerInterface[] = [];
  usersListDone: UserEventHandlerInterface[] = [];
  actionTypeList: ActionTypeInterface[] = [];
  actionTypeJobList: ActionTypeJobInterface[] = [];
  viewModeTypes = 'event_tab';
  bottomSheetData: EventHandlerBottomSheetInterface;
  data: EventHandlerDataInterface;

  constructor(private api: ApiService,
              public dialog: MatDialog,
              private eventApi : EventApiService,
              private fb: FormBuilder,
              private viewDirection: ViewDirectionService,
              private injector: Injector,
              private messageService: MessageService,
              private userInfoService: UserInfoService) {

    super(injector, userInfoService);
    this._subscription.add(
        this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  hours = hours;

  ngOnInit(): void {

    this.data = this.bottomSheetData.data;

    console.log(this.data);

    this.createForm().then(() => {
      this.editable = true;
      this.form.enable();
    });

    this.createReminderForm().then(() => {
      this.editableReminder = true;
      this.reminderForm.enable();
    });

    this._subscription.add(
        this.api.getHRUsers().subscribe((resp: any) => {
          if (resp.success) {
            this.usersList = resp.data;
          }
        })
    );

    this._subscription.add(
        this.eventApi.getAllActionType().subscribe((resp: any) => {
          if (resp.status == 200) {
            this.actionTypeList = resp.content;
          }
        })
    );
  }

  drop(event: CdkDragDrop<UserContainerInterface[]>) {
    debugger;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
    }
  }

  transferToRight(user: UserContainerInterface , event: any) {
    this.usersListDone.push(user);
    this.usersList = this.usersList.filter(obj => obj !== user);
  }

  transferToLeft(user: UserContainerInterface , event: any) {
    this.usersList.push(user);
    this.usersListDone = this.usersListDone.filter(obj => obj !== user);
  }

  changeViewMode(mode) {
    this.viewModeTypes = mode;
  }

  onChangeAction(event) {
    if(event.value.actionTypeJobModels.length)
      this.actionTypeJobList = event.value.actionTypeJobModels;
    else{
      this.actionTypeJobList = [];
      this.form.get("actionTypeJobModel").setValue([])
    }

  }

  submit(){
    let formValue = this.form.value;
    formValue.creatorUser = this.loggedInUser;
    formValue.startDate = formValue.startDate + " " + formValue.startTime + ":00";
    formValue.endDate = formValue.endDate + " " + formValue.endTime + ":00";
    if(formValue.startDate > formValue.endDate){
      return;
    }
    this._subscription.add(
        this.eventApi.addNewEvent(formValue).subscribe((resp: any) => {
          this.messageService.showMessage(resp.result);
        })
    );
  }

  cancelBtn(event) {
    this.form.disable();

    if (event) {
      if (this.data.action === 'detail') {
        if (this.editable) {
          //this.formPatchValue();
        } else {
          this.bottomSheetData.bottomSheetRef.close();
        }
      } else {
        this.bottomSheetData.bottomSheetRef.close();
      }
    }
  }

  cancelReminderBtn() {

  }

  createForm() {
    return new Promise((resolve) => {
      this.form = this.fb.group({
        // users: new FormControl([]),
        id: new FormControl(0),
        name: new FormControl('', Validators.required),
        startDate: new Date(this.data?.eventItems?.startDate).toLocaleDateString(),
        startTime: this.data?.eventItems?.sTime,
        endDate: new Date(this.data?.eventItems?.endDate).toLocaleDateString(),
        endTime: this.data?.eventItems?.eTime,
        description : new FormControl(''),
        actionType: new FormControl([], Validators.required),
        actionTypeJobModel: new FormControl([])
      });

      resolve();
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

  dateToGregorian(type: string, event: MatDatepickerInputEvent<Date>) {
    this.form.get(type).setValue(moment(event.value['_d']).format('YYYY-MM-DD'));
  }

  openAddReminderDialog() {

    let data: any = {
      action: 'add',
      eventItems : this.data.eventItems,
      rtlDirection: this.rtlDirection,

    };

    this.dialog.open(EventsHandlerAddReminderComponent, {
      data: data,
      autoFocus: false,
      width: '40%',
      height: '480px'
    });

  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
