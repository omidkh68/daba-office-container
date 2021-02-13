import {
  AfterViewInit,
  Component, ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges, ViewChild
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs/internal/Subscription';
import {TaskInterface} from '../logic/task-interface';
import {UserInterface} from '../../users/logic/user-interface';
import {ProjectInterface} from '../../projects/logic/project-interface';
import {TranslateService} from '@ngx-translate/core';
import {TaskDataInterface} from '../logic/task-data-interface';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {IDatePickerDirectiveConfig} from 'ng2-jalali-date-picker';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements AfterViewInit, OnChanges, OnInit, OnDestroy {
  @ViewChild('taskName') taskName: ElementRef<HTMLInputElement>;

  @Input()
  form: FormGroup;

  @Input()
  data: TaskDataInterface = null;

  @Input()
  editable: boolean;

  @Output()
  cancel = new EventEmitter();

  @Output()
  formOutput = new EventEmitter();

  rtlDirection = false;
  task: TaskInterface = null;
  projectsList: Array<ProjectInterface> = [];
  usersList: Array<UserInterface> = [];
  durationMinute: Array<number> = [0, 15, 30, 45];
  hours: Array<string> = [];
  boardsList = [];
  datePicker: IDatePickerDirectiveConfig = null;

  private _subscription: Subscription = new Subscription();

  constructor(private translate: TranslateService,
              private viewDirection: ViewDirectionService) {
    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => {
        this.rtlDirection = direction;

        this.setupDatepickers();

        this.setupTaskStatusWords();
      })
    );
  }

  ngOnInit(): void {
    this.usersList = this.data.usersList;
    this.projectsList = this.data.projectsList;

    if (this.data.action === 'detail') {
      this.task = this.data.task;
    } else {
      this.selectCurrentTime();
    }

    this.setupTaskStatusWords();

    this.fillHoursDropdown();
  }

  ngAfterViewInit(): void {
    this.setupDatepickers();

    if (this.editable) {
      this.taskName.nativeElement.focus();
    }
  }

  fillHoursDropdown(): void {
    const minutes = ['00', '15', '30', '45'];

    for (let i = 0; i <= 23; i++) {
      for (const minute of minutes) {
        const hourTmp = i < 10 ? `0${i}` : i.toString(10);

        this.hours.push(`${hourTmp}:${minute}`);
      }
    }
  }

  setupDatepickers(): void {
    this.datePicker = {
      locale: this.rtlDirection ? 'fa' : 'en',
      firstDayOfWeek: this.rtlDirection ? 'sa' : 'mo',
      format: 'YYYY/MM/DD',
      closeOnSelect: true,
      closeOnSelectDelay: 150
    };
  }

  setupTaskStatusWords(): void {
    setTimeout(() => {
      this.boardsList = [
        {
          id: 'todo',
          name: this.getTranslate('tasks.boards.todo')
        },
        {
          id: 'inProgress',
          name: this.getTranslate('tasks.boards.in_progress')
        },
        {
          id: 'done',
          name: this.getTranslate('tasks.boards.done')
        }
      ];
    }, 200);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.form && !changes.form.firstChange) {
      this.form = changes.form.currentValue;

      this._subscription.add(
        this.form.get('assignTo').valueChanges.subscribe(selectedValue => {
          const user = this.usersList.filter(user => user.adminId === selectedValue.adminId).pop();

          if (user) {
            this.form.get('email').setValue(user.email);
          }
        })
      );
    }
  }

  cancelBtn(): void {
    this.cancel.emit(true);
  }

  changeBoardStatus(event: string): void {
    if (event === 'done') {
      this.form.get('percentage').setValue(100);
    } else {
      if (this.data.action === 'detail') {
        if (this.data.boardStatus !== 'done') {
          this.form.get('percentage').setValue(this.task.percentage);
        }
      } else {
        this.form.get('percentage').setValue(0);
      }
    }
  }

  selectCurrentTime(): void {
    const curDate = new Date();
    const curHour = curDate.getHours() < 10 ? `0${curDate.getHours()}` : curDate.getHours();
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

    const totalCurrentTime = `${curHour}:${selectedMinute}`;

    this.form.get('startTime').setValue(totalCurrentTime);
    this.form.get('stopTime').setValue(totalCurrentTime);
  }

  /*public findInvalidControls() {
    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid.join(', ');
  }*/

  submit(): void {
    if (this.form.valid) {
      this.formOutput.emit(this.form);
    }
  }

  getTranslate(word: string): string {
    return this.translate.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
