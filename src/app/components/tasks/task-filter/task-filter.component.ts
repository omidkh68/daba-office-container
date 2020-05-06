import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import * as moment from 'moment';
import {Subscription} from 'rxjs/internal/Subscription';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FilterInterface} from '../logic/filter-interface';
import {ProjectInterface} from '../../projects/logic/project-interface';
import {UserInterface} from '../../users/logic/user-interface';
import {ApiService} from '../logic/api.service';
import {FilterTaskInterface} from '../logic/filter-task-interface';

export interface filterType {
  index: number;
  typeName: string;
  textName: string;
}

@Component({
  selector: 'app-task-filter',
  templateUrl: './task-filter.component.html',
  styleUrls: ['./task-filter.component.scss']
})
export class TaskFilterComponent implements OnInit, OnDestroy {
  filterData: FilterInterface = {
    userId: 0,
    adminId: 0,
    dateStart: '',
    dateStop: '',
    projectId: 0,
    taskName: '',
    type: '',
    typeId: 0
  };
  projectsList: ProjectInterface[] = [];
  usersList: UserInterface[] = [];
  form: FormGroup;
  filterTypes: filterType[] = [
    {
      index: 0,
      typeName: 'byCreateDate',
      textName: 'بر اساس تاریخ ایجاد تسک'
    },
    {
      index: 1,
      typeName: 'byProject',
      textName: 'بر اساس نام پروژه'
    },
    {
      index: 2,
      typeName: 'byUser',
      textName: 'بر اساس کاربر مورد نظر'
    },
    {
      index: 3,
      typeName: 'byStartDate',
      textName: 'بر اساس تاریخ شروع تسک'
    },
    {
      index: 4,
      typeName: 'byStopDate',
      textName: 'بر اساس تاریخ اتمام تسک'
    },
    {
      index: 5,
      typeName: 'byUserStartDate',
      textName: 'بر اساس تاریخ شروع کاربر'
    },
    {
      index: 6,
      typeName: 'byUserStopDate',
      textName: 'بر اساس تاریخ اتمام کاربر'
    },
    {
      index: 7,
      typeName: 'byStartedTask',
      textName: 'بر اساس تسک های شروع شده'
    },
    {
      index: 8,
      typeName: 'byPostponed',
      textName: 'بر اساس تسک های به تعویق افتاده'
    }
  ];

  private _subscription: Subscription = new Subscription();

  constructor(private api: ApiService,
              private _fb: FormBuilder,
              public dialogRef: MatDialogRef<TaskFilterComponent>,
              @Inject(MAT_DIALOG_DATA) public data: FilterTaskInterface) {
    this.usersList = this.data.usersList;
    this.projectsList = this.data.projectsList;
    this.filterData = this.data.filterData;

    const userIdExistIndex = this.usersList.findIndex(user => user.adminId === 0);

    if (userIdExistIndex === -1) {
      this.usersList.splice(0, 0, {
        adminId: 0,
        name: 'همه',
        family: ''
      });
    }

    const projectIdExistIndex = this.projectsList.findIndex(project => project.projectId === 0);

    if (projectIdExistIndex === -1) {
      this.projectsList.splice(0, 0, {
        projectId: 0,
        projectName: 'همه'
      });
    }
  }

  ngOnInit(): void {
    this.createForm().then(() => {
      this.form.patchValue({
        taskName: this.filterData.taskName ? this.filterData.taskName : '',
        projectId: this.filterData.projectId ? this.filterData.projectId : 0,
        dateStart: this.filterData.dateStart ? this.filterData.dateStart : '',
        dateStop: this.filterData.dateStop ? this.filterData.dateStop : '',
        adminId: this.filterData.adminId ? this.filterData.adminId : 0,
        type: this.filterData.type ? this.filterData.type : ''
      });

      this.form.markAllAsTouched();

      setTimeout(_ => {
        this.checkFormValidation();
      }, 1000);
    });
  }

  createForm() {
    return new Promise((resolve) => {
      this.form = this._fb.group({
        userId: new FormControl(1, Validators.required),
        typeId: new FormControl(9, Validators.required),
        taskName: new FormControl(''),
        projectId: new FormControl(0),
        dateStart: new FormControl(''),
        dateStop: new FormControl(''),
        type: new FormControl('byCreateDate', Validators.required),
        adminId: new FormControl(0),
        page: new FormControl('-1')
      });

      resolve(true);
    });
  }

  dateToGregorian(type: string, event: MatDatepickerInputEvent<Date>) {
    this.form.get(type).setValue(moment(event.value['_d']).format('YYYY-MM-DD'));
  }

  checkFormValidation() {
    if (this.form.get('type').value !== 'byProject' && this.form.get('type').value !== 'byUser') {
      this.dateRequiredValidation();
    }

    this.form.valueChanges.subscribe((selectedValue: FilterInterface) => {

      const projectIdControl = this.form.get('projectId');
      const adminIdControl = this.form.get('adminId');

      switch (selectedValue.type) {
        case 'byProject':
          this.resetFormValidation();

          if (projectIdControl.value === 0) {
            projectIdControl.setErrors({'incorrect': true});
            projectIdControl.markAsTouched();
          }

          break;

        case 'byCreateDate':
          this.dateRequiredValidation();
          break;

        case 'byStartDate':
          this.dateRequiredValidation();
          break;

        case 'byStopDate':
          this.dateRequiredValidation();
          break;

        case 'byUserStartDate':
          this.dateRequiredValidation();
          break;

        case 'byUserStopDate':
          this.dateRequiredValidation();
          break;

        case 'byUser':
          this.resetFormValidation();

          if (adminIdControl.value === 0) {
            adminIdControl.setErrors({'incorrect': true});
            adminIdControl.markAsTouched();
          }

          break;

        default:
          this.resetFormValidation();
          break;
      }
    });
  }

  dateRequiredValidation() {
    const dateStartControl = this.form.get('dateStart');
    const dateStopControl = this.form.get('dateStop');

    this.resetFormValidation();

    if (dateStartControl.value === '' || dateStopControl.value === '') {
      dateStartControl.setErrors({'incorrect': true});
      dateStopControl.setErrors({'incorrect': true});
      dateStartControl.markAsTouched();
      dateStopControl.markAsTouched();
    } else if (dateStartControl.value === '' && dateStopControl.value !== '') {
      dateStartControl.setErrors({'incorrect': true});
      dateStopControl.setErrors({'incorrect': true});
      dateStartControl.markAsTouched();
      dateStopControl.markAsTouched();
    } else if (dateStartControl.value !== '' && dateStopControl.value === '') {
      dateStartControl.setErrors({'incorrect': true});
      dateStopControl.setErrors({'incorrect': true});
      dateStartControl.markAsTouched();
      dateStopControl.markAsTouched();
    }
  }

  resetFormValidation() {
    this.form.get('projectId').setErrors(null);
    this.form.get('dateStart').setErrors(null);
    this.form.get('dateStop').setErrors(null);
    this.form.get('adminId').setErrors(null);
  }

  submit() {
    this.form.disable();

    const formValue: FilterInterface = Object.assign({}, this.form.value);

    this.filterData = Object.assign({}, this.form.value);

    if (formValue.adminId === 0) {
      delete (formValue.adminId);
    }

    if (formValue.projectId === 0) {
      delete (formValue.projectId);
    }

    if (formValue.taskName === '') {
      delete (formValue.taskName);
    }

    if (formValue.dateStart === '') {
      delete (formValue.dateStart);
    }

    if (formValue.dateStop === '') {
      delete (formValue.dateStop);
    }

    this._subscription.add(
      this.api.filterTask(formValue).subscribe((resp: any) => {
        if (resp.result === 1) {
          this.dialogRef.close(
            {
              result: 1,
              filterData: this.filterData,
              content: resp.content
            }
          );
        } else {
          this.form.enable();
        }
      })
    );
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
