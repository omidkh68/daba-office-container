import {AfterViewInit, Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../logic/api.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/internal/Subscription';
import {TaskInterface} from '../logic/task-interface';
import {UserInterface} from '../../users/logic/user-interface';
import {LoginDataClass} from '../../../services/loginData.class';
import {UserInfoService} from '../../users/services/user-info.service';
import {ApproveComponent} from '../../approve/approve.component';
import {ProjectInterface} from '../../projects/logic/project-interface';
import {RefreshBoardService} from '../services/refresh-board.service';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {LoadingIndicatorService} from '../../../services/loading-indicator.service';
import {TaskBottomSheetInterface} from '../task-bottom-sheet/logic/TaskBottomSheet.interface';

@Component({
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent extends LoginDataClass implements OnInit, AfterViewInit, OnDestroy {
  rtlDirection: boolean;
  editable: boolean = false;
  task: TaskInterface = null;
  projectsList: ProjectInterface[] = [];
  usersList: UserInterface[] = [];
  form: FormGroup;
  viewModeTypes = 'info';
  bottomSheetData: TaskBottomSheetInterface;
  data: any;

  private _subscription: Subscription = new Subscription();

  constructor(private api: ApiService,
              private _fb: FormBuilder,
              public dialog: MatDialog,
              private injector: Injector,
              private refreshBoardService: RefreshBoardService,
              private loadingIndicatorService: LoadingIndicatorService,
              private userInfoService: UserInfoService,
              private viewDirection: ViewDirectionService) {
    super(injector, userInfoService);

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngOnInit(): void {
    this.data = this.bottomSheetData.data;
    this.usersList = this.data.usersList;
    this.projectsList = this.data.projectsList;
    this.task = this.data.task;
  }

  ngAfterViewInit(): void {
    this.createForm().then(() => {
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
        email: new FormControl('0'),
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
        assigner: new FormControl(this.loggedInUser.email, Validators.required),
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
      if (this.data.action === 'detail') {
        if (this.editable) {
          this.formPatchValue();
        } else {
          this.bottomSheetData.bottomSheetRef.close();
        }
      } else {
        this.bottomSheetData.bottomSheetRef.close();
      }
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
      boardStatus: this.data.boardStatus,
      taskDateStart: this.task.taskDateStart,
      taskDateStop: this.task.taskDateStop,
      assigner: this.task.assigner,
      trackable: this.task.trackable
    });
  }

  editableForm() {
    this.editable = !this.editable;

    if (this.editable) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }

  deleteTask() {
    const dialogRef = this.dialog.open(ApproveComponent, {
      data: {title: 'حذف تسک', message: 'آیا از حذف این تسک اطمینان دارید؟'},
      autoFocus: false,
      width: '70vh',
      maxWidth: '350px',
      panelClass: 'approve-detail-dialog',
      height: '160px'
    });

    this._subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadingIndicatorService.changeLoadingStatus(true);

          this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

          this._subscription.add(
            this.api.deleteTask(this.task).subscribe((resp: any) => {
              this.loadingIndicatorService.changeLoadingStatus(false);

              if (resp.result) {
                this.bottomSheetData.bottomSheetRef.close();

                this.refreshBoardService.changeCurrentDoRefresh(true);
              } else {
                // show message
              }
            }, error => {
              this.loadingIndicatorService.changeLoadingStatus(false);
            })
          );
        }
      })
    );
  }

  submit() {
    this.loadingIndicatorService.changeLoadingStatus(true);
    // this.form.disable();

    const formValue = Object.assign({}, this.form.value);

    formValue.startAt = formValue.startAt + ' ' + formValue.startTime + ':00';
    formValue.stopAt = formValue.stopAt + ' ' + formValue.stopTime + ':00';

    // formValue.assigner = this.usersList.filter(user => user.email === this.user.email).pop();

    this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    this._subscription.add(
      this.api.updateTask(formValue).subscribe((resp: any) => {
        this.loadingIndicatorService.changeLoadingStatus(false);

        const data = {
          prevContainer: this.task.boardStatus,
          newContainer: this.form.get('boardStatus').value,
          task: resp.content.task
        };

        if (resp.result) {
          this.bottomSheetData.bottomSheetRef.close();

          this.refreshBoardService.changeCurrentDoRefresh(true);
        } else {
          this.form.enable();
        }
      }, error => {
        this.form.enable();

        this.loadingIndicatorService.changeLoadingStatus(false);
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
