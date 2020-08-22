import {
    AfterViewInit,
    Component, ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy, OnInit,
    Output, SimpleChanges, ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import dayGridPlugin from '@fullcalendar/daygrid';
import {Subscription} from 'rxjs/internal/Subscription';
import {TaskInterface} from '../../logic/task-interface';
import {UserInterface} from '../../../users/logic/user-interface';
import {TranslateService} from '@ngx-translate/core';
import {TaskDataInterface} from '../../logic/task-data-interface';
import {TaskDetailComponent} from '../../task-detail/task-detail.component';
import {ViewDirectionService} from '../../../../services/view-direction.service';
import {TaskBottomSheetInterface} from '../../task-bottom-sheet/logic/TaskBottomSheet.interface';
import {TaskCalendarService} from "../services/task-calendar.service";

@Component({
    selector: 'app-task-calendar-weekday',
    templateUrl: './task-calendar-weekday.component.html',
    styleUrls: ['./task-calendar-weekday.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TaskCalendarWeekdayComponent implements AfterViewInit, OnDestroy {
    @Input()
    calendarEvents: any;

    @Input()
    loginData: any;

    @Input()
    holidays: [];

    @Output()
    triggerBottomSheet: EventEmitter<TaskBottomSheetInterface> = new EventEmitter<TaskBottomSheetInterface>();


    rtlDirection: boolean;
    header = {};
    buttonLabels = {};
    slotLabelFormat = [{
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }];

    views = {};

    calendarPlugins = [dayGridPlugin];
    tasks: TaskInterface[] = [];
    options: any;

    usersList: UserInterface[] = [];

    private _subscription: Subscription = new Subscription();

    constructor(public dialog: MatDialog,
                private viewDirection: ViewDirectionService,
                private taskCalendarService: TaskCalendarService,
                private translateService: TranslateService) {
        this._subscription.add(
            this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
        );
    }

    ngAfterViewInit(): void {

        this.views = {
            dayGridMonthCustom: {
                type: 'dayGridMonth',
                buttonText: this.getTranslate('tasks.calendar.month')
            }
        };

        this.buttonLabels = {
            today: this.getTranslate('tasks.calendar.today'),
            month: this.getTranslate('tasks.calendar.month'),
            week: this.getTranslate('tasks.calendar.week'),
            day: this.getTranslate('tasks.calendar.day'),
            list: this.getTranslate('tasks.calendar.list')
        };

        if (this.rtlDirection) {
            this.header = {
                left: 'title',
                center: '',
                right: 'prev,next today'
            };
        } else {
            this.header = {
                left: 'today next,prev',
                center: 'title',
                right: 'timeGridWeek,timeGridDay'
            };
        }
    }

    eventRender(event: any) {

        if (event.event.extendedProps.imageurl) {
            var tag = event.el.getElementsByClassName('fc-title');

            tag[0].insertAdjacentHTML('beforeBegin',
                '<img class=\'round-corner-all float-right\' src=\'' + event.event.extendedProps.imageurl + '\' width=\'20px\' height=\'20px\'>');

        }
    }

    eventClick(event: any) {

        let boardStatus: any;

        const data: TaskDataInterface = {
            action: 'detail',
            usersList: event.event.extendedProps.usersList,
            projectsList: event.event.extendedProps.projectsList,
            task: event.event.extendedProps,
            boardStatus: boardStatus
        };

        this.triggerBottomSheet.emit({
            component: TaskDetailComponent,
            height: '98%',
            width: '98%',
            data: data
        });
    }

    getTranslate(word) {
        return this.translateService.instant(word);
    }


    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    ngAfterViewChecked() {
        let weekdayContainer = document.getElementsByClassName("holiday-date");
        if (!weekdayContainer.length) {
            this.taskCalendarService.setHolidayHighlight(this.holidays);
        }
    }
}
