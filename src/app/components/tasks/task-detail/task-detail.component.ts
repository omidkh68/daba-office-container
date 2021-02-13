import {AfterViewInit, Component, HostListener, Injector, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../logic/api.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/internal/Subscription';
import {TaskInterface} from '../logic/task-interface';
import {UserInterface} from '../../users/logic/user-interface';
import {LoginDataClass} from '../../../services/loginData.class';
import {MessageService} from '../../message/service/message.service';
import * as moment from 'moment';
import * as jalaliMoment from 'jalali-moment';
import {UserInfoService} from '../../users/services/user-info.service';
import {ApproveComponent} from '../../approve/approve.component';
import {ProjectInterface} from '../../projects/logic/project-interface';
import {TranslateService} from '@ngx-translate/core';
import {HttpErrorResponse} from '@angular/common/http';
import {TaskDataInterface} from '../logic/task-data-interface';
import {TaskStopComponent} from '../task-stop/task-stop.component';
import {RefreshBoardService} from '../services/refresh-board.service';
import {RefreshLoginService} from '../../login/services/refresh-login.service';
import {
  BreadcrumbTaskInterface,
  ResultBreadcrumbInterface,
  ResultTaskDetailInterface
} from '../logic/board-interface';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {WindowManagerService} from '../../../services/window-manager.service';
import {BottomSheetDataService} from '../services/BottomSheetData.service';
import {LoadingIndicatorService} from '../../../services/loading-indicator.service';
import {TaskBottomSheetInterface} from '../task-bottom-sheet/logic/TaskBottomSheet.interface';
import {TaskEssentialInfoService} from '../../../services/taskEssentialInfo.service';

@Component({
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent extends LoginDataClass implements OnInit, AfterViewInit, OnDestroy {
  rtlDirection = false;
  editable = false;
  task: TaskInterface = null;
  breadcrumbList: Array<BreadcrumbTaskInterface> = [];
  projectsList: Array<ProjectInterface> = [];
  usersList: Array<UserInterface> = [];

  projectsListNew: Array<ProjectInterface> = [];
  usersListNew: Array<UserInterface> = [];
  form: FormGroup;
  viewModeTypes = 'info';
  bottomSheetData: TaskBottomSheetInterface;
  data: any;

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private fb: FormBuilder,
              private injector: Injector,
              private apiService: ApiService,
              private messageService: MessageService,
              private userInfoService: UserInfoService,
              private translateService: TranslateService,
              private viewDirection: ViewDirectionService,
              private refreshLoginService: RefreshLoginService,
              private refreshBoardService: RefreshBoardService,
              private windowManagerService: WindowManagerService,
              private bottomSheetDataService: BottomSheetDataService,
              private loadingIndicatorService: LoadingIndicatorService,
              private taskEssentialInfoService: TaskEssentialInfoService) {
    super(injector, userInfoService);

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => {
        this.rtlDirection = direction;

        if (this.form) {
          this.formPatchValue();
        }
      })
    );

    this._subscription.add(
      this.bottomSheetDataService.currentButtonSheetData.subscribe((sheetData: TaskBottomSheetInterface) => {
        if (sheetData) {
          this.bottomSheetData = sheetData;

          this.breadcrumbList = this.bottomSheetData.data.breadCrumbList && this.bottomSheetData.data.breadCrumbList.length ? this.bottomSheetData.data.breadCrumbList : [] ;
          console.log(this.breadcrumbList);
        }
      })
    );
  }

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(): void {
    this.bottomSheetData.bottomSheetRef.close();
  }

  ngOnInit(): void {
    this.data = this.bottomSheetData.data;
    this.usersList = this.data.usersList;
    this.projectsList = this.data.projectsList;
    this.task = this.data.task;
    // this.breadcrumbList = this.data.breadcrumbList;
  }

  ngAfterViewInit(): void {
    this.createForm().then(() => {
      if (this.data.action === 'detail') {
        this.formPatchValue();

        this.formValidationCheck();

        this.getBreadcrumbData(this.task.taskId).then((breadCrumbs: Array<BreadcrumbTaskInterface>) => {
          this.breadcrumbList = breadCrumbs;
        });
      }
    });
  }

  createForm(): Promise<boolean> {
    return new Promise((resolve) => {
      this.form = this.fb.group({
        taskId: new FormControl(0),
        taskName: new FormControl('', Validators.required),
        percentage: new FormControl(0, Validators.required),
        assignTo: new FormControl({adminId: 0}, Validators.required),
        email: new FormControl('0'),
        taskDurationHours: new FormControl(1, [Validators.required, Validators.pattern('^[0-9]+'), Validators.min(1), Validators.max(999)]),
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

      resolve(true);
    });
  }

  updateForm(event: FormGroup): void {
    this.form = event;

    this.submit();
  }

  cancelBtn(event: boolean): void {
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
    } else {
      this.bottomSheetData.bottomSheetRef.close();
    }
  }

  formPatchValue(): void {
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

    let taskStartDate;
    let taskStopDate;

    if (startDate[0] !== 'Invalid') {
      taskStartDate = jalaliMoment.from(startDate[0], 'en', 'YYYY-MM-DD').locale(this.rtlDirection ? 'fa' : 'en').format('YYYY/MM/DD');
    } else {
      taskStartDate = null;
    }

    if (stopDate[0] !== 'Invalid') {
      taskStopDate = jalaliMoment.from(stopDate[0], 'en', 'YYYY-MM-DD').locale(this.rtlDirection ? 'fa' : 'en').format('YYYY/MM/DD');
    } else {
      taskStopDate = null;
    }

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

  formValidationCheck(): void {
    this._subscription.add(
      this.form.get('taskName').valueChanges.subscribe((selectedValue: string) => {
        const taskNameControl = this.form.get('taskName');

        const taskName = selectedValue.trim();

        if (taskName.length) {
          taskNameControl.setErrors(null);
        } else {
          taskNameControl.setErrors({'incorrect': true});
          taskNameControl.markAsTouched();
        }
      })
    );

    this._subscription.add(
      this.form.get('assignTo').valueChanges.subscribe(selectedValue => {
        const user = this.usersList.filter(user => user.adminId === selectedValue.adminId).pop();

        if (user) {
          this.form.get('email').setValue(user.email);
        }
      })
    );

    this._subscription.add(
      this.form.get('startAt').valueChanges.subscribe(selectedValue => {
        const startAtControl = this.form.get('startAt');
        const stopAtControl = this.form.get('stopAt');
        const stopAt = stopAtControl.value;

        if (stopAt) {
          let m;

          if (this.rtlDirection) {
            m = jalaliMoment(selectedValue, 'YYYY/MM/DD').isAfter(jalaliMoment(stopAt, 'YYYY/MM/DD'));
          } else {
            m = moment(selectedValue, 'YYYY/MM/DD').isAfter(moment(stopAt, 'YYYY/MM/DD'));
          }

          if (m) {
            startAtControl.setErrors({'incorrect': true});
            startAtControl.markAsTouched();
          } else {
            startAtControl.setErrors(null);
            stopAtControl.setErrors(null);
          }
        }
      })
    );

    this._subscription.add(
      this.form.get('stopAt').valueChanges.subscribe(selectedValue => {
        const stopAtControl = this.form.get('stopAt');
        const startAtControl = this.form.get('startAt');
        const startAt = startAtControl.value;

        if (startAt) {
          let m;

          if (this.rtlDirection) {
            m = jalaliMoment(selectedValue, 'YYYY/MM/DD').isBefore(jalaliMoment(startAt, 'YYYY/MM/DD'));
          } else {
            m = moment(selectedValue, 'YYYY/MM/DD').isBefore(moment(startAt, 'YYYY/MM/DD'));
          }

          if (m) {
            stopAtControl.setErrors({'incorrect': true});
            stopAtControl.markAsTouched();
          } else {
            stopAtControl.setErrors(null);
            startAtControl.setErrors(null);
          }
        }
      })
    );
  }

  editableForm(): void {
    this.editable = true;

    if (this.editable) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }

  deleteTask(): void {
    this.form.disable();
    this.editable = false;

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

    this._subscription.add(
      dialogRef.afterOpened().subscribe(() => {
        this.windowManagerService.dialogOnTop(dialogRef.id);
      })
    );

    this._subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'project'});

          this.apiService.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

          this._subscription.add(
            this.apiService.deleteTask(this.task, this.loggedInUser.email).subscribe((resp: any) => {
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

  submit(): void {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'project'});

    const formValue: TaskInterface = {...this.form.value};

    if (this.rtlDirection) {
      formValue.startAt = jalaliMoment.from(formValue.startAt, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY-MM-DD');
      formValue.stopAt = jalaliMoment.from(formValue.stopAt, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY-MM-DD');
    } else {
      formValue.startAt = moment(formValue.startAt, 'YYYY/MM/DD').format('YYYY-MM-DD');
      formValue.stopAt = moment(formValue.stopAt, 'YYYY/MM/DD').format('YYYY-MM-DD');
    }

    formValue.startAt = formValue.startAt + ' ' + formValue.startTime + ':00';
    formValue.stopAt = formValue.stopAt + ' ' + formValue.stopTime + ':00';

    this.apiService.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;

    this.form.disable();

    this._subscription.add(
      this.apiService.updateTask(formValue).subscribe((resp: any) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

        if (resp.result) {
          if (resp.content.parentTaskId === 0) {
            this.bottomSheetData.bottomSheetRef.close();
          } else {
            this.editableForm();

            this.editable = false;
          }

          if (this.task.boardStatus === 'inProgress' && (formValue.boardStatus === 'todo' || formValue.boardStatus === 'done')) {
            this.showTaskStopModal(formValue);
          } else if (this.task.boardStatus === 'todo' && formValue.boardStatus === 'done') {
            this.showTaskStopModal(formValue);
          } else if (this.task.boardStatus === 'done' && formValue.boardStatus === 'todo') {
            const editedTask: TaskInterface = {...formValue, percentage: 0, boardStatus: 'todo'};
            this.showTaskStopModal(editedTask);
          }

          this.messageService.showMessage(resp.message);

          this.refreshBoardService.changeCurrentDoRefresh(true);
        } else {
          this.form.enable();

          this.messageService.showMessage(resp.message);
        }
      }, (error: HttpErrorResponse) => {
        if (error.message) {
          this.messageService.showMessage(error.message);
        }

        this.form.enable();

        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

        this.refreshLoginService.openLoginDialog(error);
      })
    );
  }

  showTaskStopModal(task: TaskInterface): void {
    const dialogRef = this.dialog.open(TaskStopComponent, {
      data: task,
      autoFocus: false,
      width: '500px',
      height: '310px',
      disableClose: true
    });

    this._subscription.add(
      dialogRef.afterOpened().subscribe(() => {
        this.windowManagerService.dialogOnTop(dialogRef.id);
      })
    );

    this._subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // this.getBoards();

          // this.doResetFilter();
        }
      })
    );
  }

  openTask(taskId: number): void {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'project'});

    this.getBoardData().then(() => {
      this.getTaskDetail(taskId).then((task: TaskInterface) => {
        // this.getBreadcrumbData(task.taskId).then(() => {
        this.bottomSheetData.bottomSheetRef.close();

        this.usersListNew.map(user => {
          if (task.assignTo.adminId === user.adminId) {
            task.assignTo = user;
          }
        });

        this.projectsListNew.map(project => {
          if (task.project.projectId === project.projectId) {
            task.project = project;
          }
        });

        setTimeout(() => {
          const data: TaskDataInterface = {
            action: 'detail',
            usersList: this.usersListNew,
            projectsList: this.projectsListNew,
            task: task,
            boardStatus: task.boardStatus,
            breadCrumbList: this.breadcrumbList
          };

          const finalData = {
            component: TaskDetailComponent,
            height: '98%',
            width: '95%',
            data: data
          };

          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

          this.bottomSheetDataService.changeButtonSheetData(finalData);
        }, 500);
        // });
      });
    });
  }

  getBoardData(): Promise<boolean> {
    return new Promise((resolve) => {
      this.usersListNew = this.taskEssentialInfoService.getUsersProjectsList.usersList;

      this.projectsListNew = this.taskEssentialInfoService.getUsersProjectsList.projectsList;

      resolve(true);
    });
  }

  getTaskDetail(taskId: number): Promise<TaskInterface> {
    return new Promise((resolve) => {
      this._subscription.add(
        this.apiService.getTaskDetail(taskId).subscribe((resp: ResultTaskDetailInterface) => {
          if (resp.result) {
            resolve(resp.content);
          }
        }, (error: HttpErrorResponse) => {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

          this.refreshLoginService.openLoginDialog(error);
        })
      );
    });
  }

  getBreadcrumbData(taskId: number): Promise<Array<BreadcrumbTaskInterface>> {
    return new Promise((resolve) => {
      this._subscription.add(
        this.apiService.getBreadcrumb(taskId).subscribe((resp: ResultBreadcrumbInterface) => {
          if (resp.result === 1) {
            resolve(resp.contents);
          }
        }, (error: HttpErrorResponse) => {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'project'});

          this.refreshLoginService.openLoginDialog(error);
        })
      );
    });
  }

  getTranslate(word: string): string {
    return this.translateService.instant(word);
  }

  changeViewMode(mode: string): void {
    this.viewModeTypes = mode;
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
