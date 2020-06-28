import {AfterViewInit, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TaskInterface} from '../logic/task-interface';
import {ProjectInterface} from '../../projects/logic/project-interface';
// import {UserInterface} from '../../users/logic/user-interface';
import {ApiService} from '../logic/api.service';
// import {TaskDataInterface} from '../logic/task-data-interface';
// import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {UserInfoService} from '../../users/services/user-info.service';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {TaskBottomSheetInterface} from '../task-bottom-sheet/logic/TaskBottomSheet.interface';
import {UserContainerInterface} from '../../users/logic/user-container.interface';

@Component({
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  rtlDirection: boolean;
  user: UserContainerInterface = null;
  editable: boolean = false;
  task: TaskInterface = null;
  projectsList: ProjectInterface[] = [];
  usersList: UserContainerInterface[] = [];
  form: FormGroup;
  viewModeTypes = 'info';
  bottomSheetData: TaskBottomSheetInterface;
  data: any;

  private _subscription: Subscription = new Subscription();

  constructor(private api: ApiService,
              private _fb: FormBuilder,
              // public bottomSheetRef: MatBottomSheetRef<TaskDetailComponent>,
              private userInfoService: UserInfoService,
              private viewDirection: ViewDirectionService
              /* @Inject(MAT_BOTTOM_SHEET_DATA) public data: TaskDataInterface*/) {
    this._subscription.add(
      this.userInfoService.currentUserInfo.subscribe(user => this.user = user)
    );

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngOnInit(): void {
    this.data = this.bottomSheetData.data;

    // this.usersList = this.data.usersList;
    this.usersList = this.data.usersList;
    // this.projectsList = this.data.projectsList;
    this.projectsList = this.data.projectsList;
    // this.task = this.data.task;
    this.task = this.data.task;
  }

  ngAfterViewInit(): void {
    this.createForm().then(() => {
      // if (this.data.action === 'detail') {
      if (this.data.action === 'detail') {
        this.formPatchValue();
      }
    });
  }

  createForm() {
    return new Promise((resolve) => {
      this.form = this._fb.group({
        taskId: new FormControl(0),
        taskName: new FormControl('', Validators.required),
        percentage: new FormControl(0, Validators.required),
        assignTo: new FormControl({adminId: 0}, Validators.required),
        email: new FormControl('0', Validators.required),
        taskDurationHours: new FormControl(0, [Validators.required, Validators.pattern('^[0-9]+')]),
        taskDurationMinutes: new FormControl(0, Validators.required),
        startAt: new FormControl('', Validators.required),
        stopAt: new FormControl('', Validators.required),
        startTime: new FormControl('', Validators.required),
        stopTime: new FormControl('', Validators.required),
        project: new FormControl({}, Validators.required),
        taskDesc: new FormControl(''),
        boardStatus: new FormControl('', Validators.required),
        taskDateStart: '0000-00-00 00:00:00',
        taskDateStop: '0000-00-00 00:00:00',
        assigner: new FormControl(this.user, Validators.required),
        trackable: new FormControl(0)
      });

      resolve();
    });
  }

  updateForm(event) {
    this.form = event;

    this.submit();
  }

  cancelBtn(event) {
    this.form.disable();

    if (event) {
      // if (this.data.action === 'detail') {
      if (this.data.action === 'detail') {
        if (this.editable) {
          this.formPatchValue();
        } else {
          // this.bottomSheetRef.dismiss(false);
          this.bottomSheetData.bottomSheetRef.close();
        }
      } else {
        // this.bottomSheetRef.dismiss(false);
        this.bottomSheetData.bottomSheetRef.close();
      }
    }
  }

  editableForm() {
    this.editable = !this.editable;

    if (this.editable) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }

  formPatchValue() {
    this.form.disable();
    this.editable = false;

    const startDate = this.task.startAt.split(' ');
    const stopDate = this.task.stopAt.split(' ');

    const startTimeTmp = startDate[1].split(':');
    const stopTimeTmp = stopDate[1].split(':');

    const startTime = startTimeTmp[0] + ':' + startTimeTmp[1];
    const stopTime = stopTimeTmp[0] + ':' + stopTimeTmp[1];

    const selectedProject = this.projectsList.filter(project => project.projectId === this.task.project.projectId).pop();
    const selectedAssignTo = this.usersList.filter(user => user.email === this.task.assignTo.email).pop();

    const selectedAssigner = this.usersList.filter(user => user.email === this.user.email).pop();

    this.form.patchValue({
      taskId: this.task.taskId,
      taskName: this.task.taskName,
      percentage: this.task.percentage,
      assignTo: selectedAssignTo,
      taskDurationHours: this.task.taskDurationHours,
      taskDurationMinutes: this.task.taskDurationMinutes,
      startAt: startDate[0],
      startTime: startTime,
      stopAt: stopDate[0],
      stopTime: stopTime,
      project: selectedProject,
      taskDesc: this.task.taskDesc,
      email: selectedAssignTo.email,
      // boardStatus: this.data.boardStatus,
      boardStatus: this.data.boardStatus,
      taskDateStart: this.task.taskDateStart,
      taskDateStop: this.task.taskDateStop,
      assigner: selectedAssigner,
      trackable: this.task.trackable
    });
  }

  deleteTask() {
    this._subscription.add(
      this.api.deleteTask(this.task).subscribe((resp: any) => {
        // this.bottomSheetRef.dismiss(true);
        this.bottomSheetData.bottomSheetRef.close();
      })
    );
  }

  submit() {
    this.form.disable();

    const formValue = Object.assign({}, this.form.value);

    formValue.startAt = formValue.startAt + ' ' + formValue.startTime + ':00';
    formValue.stopAt = formValue.stopAt + ' ' + formValue.stopTime + ':00';

    formValue.assigner = this.usersList.filter(user => user.email === this.user.email).pop();

    this._subscription.add(
      this.api.updateTask(formValue).subscribe((resp: any) => {
        const data = {
          prevContainer: this.task.boardStatus,
          newContainer: this.form.get('boardStatus').value,
          task: resp.content.task
        };

        if (resp.result === 1) {
          // this.bottomSheetRef.dismiss(data);
          this.bottomSheetData.bottomSheetRef.close();
        } else {
          this.form.enable();
        }
      }, () => {
        this.form.enable();
      })
    );
  }

  changeViewMode(mode) {
    this.viewModeTypes = mode;
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
