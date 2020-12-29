import {AfterViewInit, Component, HostListener, Injector, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../logic/api.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/internal/Subscription';
import {TaskInterface} from '../logic/task-interface';
import {UserInterface} from '../../users/logic/user-interface';
import {LoginDataClass} from '../../../services/loginData.class';
import {MessageService} from '../../message/service/message.service';
import * as jalaliMoment from 'jalali-moment';
import {UserInfoService} from '../../users/services/user-info.service';
import {ApproveComponent} from '../../approve/approve.component';
import {ProjectInterface} from '../../projects/logic/project-interface';
import {TranslateService} from '@ngx-translate/core';
import {HttpErrorResponse} from '@angular/common/http';
import {TaskDataInterface} from '../logic/task-data-interface';
import {RefreshBoardService} from '../services/refresh-board.service';
import {RefreshLoginService} from '../../login/services/refresh-login.service';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {WindowManagerService} from '../../../services/window-manager.service';
import {LoadingIndicatorService} from '../../../services/loading-indicator.service';
import {ButtonSheetDataService} from '../../../services/ButtonSheetData.service';
import {TaskBottomSheetInterface} from '../task-bottom-sheet/logic/TaskBottomSheet.interface';
import {TaskEssentialInfoService} from '../../../services/taskEssentialInfo';

@Component({
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent extends LoginDataClass implements OnInit, AfterViewInit, OnDestroy {
  rtlDirection: boolean;
  editable: boolean = false;
  task: TaskInterface = null;
  breadcrumbList: TaskInterface[] = [];
  projectsList: ProjectInterface[] = [];
  usersList: UserInterface[] = [];

  projectsListNew: ProjectInterface[] = [];
  usersListNew: UserInterface[] = [];
  form: FormGroup;
  viewModeTypes = 'info';
  bottomSheetData: TaskBottomSheetInterface;
  data: any;

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private fb: FormBuilder,
              private api: ApiService,
              private injector: Injector,
              private messageService: MessageService,
              private userInfoService: UserInfoService,
              private translateService: TranslateService,
              private viewDirection: ViewDirectionService,
              private refreshLoginService: RefreshLoginService,
              private refreshBoardService: RefreshBoardService,
              private windowManagerService: WindowManagerService,
              private buttonSheetDataService: ButtonSheetDataService,
              private taskEssentialInfoService: TaskEssentialInfoService,
              private loadingIndicatorService: LoadingIndicatorService) {
    super(injector, userInfoService);

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => {
        this.rtlDirection = direction;

        if (this.form) {
          this.formPatchValue();
        }
      })
    );
  }

  ngOnInit(): void {
    this.data = this.bottomSheetData.data;
    this.usersList = this.data.usersList;
    this.projectsList = this.data.projectsList;
    this.task = this.data.task;
    this.breadcrumbList = this.data.breadcrumbList
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
      this.form = this.fb.group({
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
        status: new FormControl(0),
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

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
    this.bottomSheetData.bottomSheetRef.close();
  }

  formPatchValue() {
    this.form.disable();
    this.editable = false;

    const startDate = this.task.startAt ? this.task.startAt.split(' ') : null;
    const stopDate = this.task.stopAt ? this.task.stopAt.split(' ') : null;

    const startTimeTmp = startDate ? startDate[1].split(':') : null;
    const stopTimeTmp = stopDate ? stopDate[1].split(':') : null;

    const startTime = startTimeTmp ? startTimeTmp[0] + ':' + startTimeTmp[1] : null;
    const stopTime = stopTimeTmp ? stopTimeTmp[0] + ':' + stopTimeTmp[1] : null;

    const selectedProject = this.projectsList.filter(project => project.projectId === this.task.project.projectId).pop();
    const selectedAssignTo = this.usersList.filter(user => user.email === this.task.assignTo.email).pop();

    const taskStartDate = jalaliMoment.from(startDate[0], 'en', 'YYYY-MM-DD').locale(this.rtlDirection ? 'fa': 'en').format('YYYY/MM/DD');
    const taskStopDate = jalaliMoment.from(stopDate[0], 'en', 'YYYY-MM-DD').locale(this.rtlDirection ? 'fa': 'en').format('YYYY/MM/DD');

    this.form.patchValue({
      taskId: this.task.taskId,
      taskName: this.task.taskName,
      percentage: this.task.percentage,
      assignTo: selectedAssignTo,
      taskDurationHours: this.task.taskDurationHours,
      taskDurationMinutes: this.task.taskDurationMinutes,
      startAt: taskStartDate,
      startTime: startTime,
      stopAt: taskStopDate,
      stopTime: stopTime,
      project: selectedProject,
      taskDesc: this.task.taskDesc,
      email: selectedAssignTo.email,
      boardStatus: this.data.boardStatus,
      taskDateStart: this.task.taskDateStart,
      taskDateStop: this.task.taskDateStop,
      assigner: this.task.assigner,
      status: this.task.status,
      trackable: this.task.trackable
    });
  }

  editableForm() {
    this.editable = true;

    if (this.editable) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }

  deleteTask() {
    const dialogRef = this.dialog.open(ApproveComponent, {
      data: {
        title: this.getTranslate('tasks.task_detail.delete_title'),
        message: this.getTranslate('tasks.task_detail.delete_text')
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
          this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'project'});

          this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

          this._subscription.add(
            this.api.deleteTask(this.task).subscribe((resp: any) => {
              this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

              if (resp.result) {
                this.bottomSheetData.bottomSheetRef.close();

                this.messageService.showMessage(resp.message);

                this.refreshBoardService.changeCurrentDoRefresh(true);
              } else {
                // show message
                this.messageService.showMessage(resp.message);
              }
            }, (error: HttpErrorResponse) => {
              this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

              this.refreshLoginService.openLoginDialog(error);
            })
          );
        }
      })
    );
  }

  submit() {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'project'});

    const formValue = {...this.form.value};
    let taskStartDate = '';
    let taskStopDate = '';

    if (this.rtlDirection) {
      taskStartDate = jalaliMoment(formValue.startAt).locale('en').format('YYYY-MM-DD');
      taskStopDate = jalaliMoment(formValue.stopAt).locale('en').format('YYYY-MM-DD');
    } else {
      taskStartDate = formValue.startAt;
      taskStopDate = formValue.stopAt;
    }

    formValue.startAt_tmp = taskStartDate + ' ' + formValue.startTime + ':00';
    formValue.stopAt_tmp = taskStopDate + ' ' + formValue.stopTime + ':00';

    this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    this.form.disable();

    console.log(formValue);

    return;

    /*this._subscription.add(
      this.api.updateTask(formValue).subscribe((resp: any) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

        if (resp.result) {
          this.bottomSheetData.bottomSheetRef.close();

          this.messageService.showMessage(resp.message);

          this.refreshBoardService.changeCurrentDoRefresh(true);
        } else {
          this.form.enable();
        }
      }, (error: HttpErrorResponse) => {
        this.form.enable();

        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

        this.refreshLoginService.openLoginDialog(error);
      })
    );*/
  }

  openTask(task) {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'project'});

    this.getBoardData().then(() => {
      this.getBreadcrumbData(task.taskId).then(() => {
        this.bottomSheetData.bottomSheetRef.close();

        this.usersListNew.map(user => {
          if (task.assignTo === user.adminId) {
            task.assignTo = user
          }
        });

        this.projectsListNew.map(project => {
          if (task.project === project.projectId) {
            task.project = project
          }
        });

        setTimeout(() => {
          const data: TaskDataInterface = {
            action: 'detail',
            usersList: this.usersListNew,
            projectsList: this.projectsListNew,
            task: task,
            boardStatus: task.boardStatus,
            breadcrumbList: this.breadcrumbList
          };

          const finalData = {
            component: TaskDetailComponent,
            height: '98%',
            width: '95%',
            data: data
          };

          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

          this.buttonSheetDataService.changeButtonSheetData(finalData);
        }, 500)
      })

    })
  }

  getBoardData() {
    return new Promise((resolve) => {
      this._subscription.add(
        this.taskEssentialInfoService.currentUsersProjectsList.subscribe((data) => {

            this.usersListNew = data.usersList;
            this.projectsListNew = data.projectsList;

            resolve(true);
          }
        )
      );
    });
  }

  getBreadcrumbData(taskId) {
    return new Promise((resolve) => {
      this._subscription.add(
        this.api.getBreadcrumb(taskId).subscribe((resp: any) => {
          if (resp.result === 1) {

            this.breadcrumbList = resp.content;
            resolve(true);
          }
        }, (error: HttpErrorResponse) => {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

          this.refreshLoginService.openLoginDialog(error);
        })
      );
    });
  }

  getTranslate(word) {
    return this.translateService.instant(word);
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
