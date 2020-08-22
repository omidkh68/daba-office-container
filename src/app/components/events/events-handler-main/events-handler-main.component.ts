import {AfterViewInit, Component, Injector, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import dayGridPlugin from '@fullcalendar/daygrid';
import {MatDialog} from "@angular/material/dialog";
import {ViewDirectionService} from "../../../services/view-direction.service";
import {TranslateService} from "@ngx-translate/core";
import {FullCalendarComponent} from "@fullcalendar/angular";
import {ApiService} from "../../tasks/logic/api.service";
import {TaskCalendarService} from "../../tasks/task-calendar/services/task-calendar.service";
import {LoginDataClass} from "../../../services/loginData.class";
import {UserInfoService} from "../../users/services/user-info.service";

@Component({
    selector: 'app-events-handler-main',
    templateUrl: './events-handler-main.component.html',
    styleUrls: ['./events-handler-main.component.scss']
})
export class EventsHandlerMainComponent extends LoginDataClass implements AfterViewInit, OnDestroy, OnInit {

    @ViewChild('calendar') calendarComponent: FullCalendarComponent;
    @ViewChild('drawer') drawer: any; // the #calendar in the template

    holidays = [];

    rtlDirection: boolean;
    private _subscription: Subscription = new Subscription();
    calendarPlugins = [dayGridPlugin];

    buttonLabels = {};
    views = {};
    header = {};
    slotLabelFormat = [{
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }];

    constructor(public dialog: MatDialog,
                private injector: Injector,
                private userInfoService: UserInfoService,
                private viewDirection: ViewDirectionService,
                private taskCalendarService: TaskCalendarService,
                private api: ApiService,
                private translateService: TranslateService) {
        super(injector, userInfoService);
        this._subscription.add(
            this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
        );
    }

    ngOnInit(): void {
        this.api.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;
        this._subscription.add(
            this.api.getAllHolidays().subscribe((resp: any) => {
                resp.content.forEach((element: any) => {
                    this.holidays.push(element.date)
                })
            })
        );
    }

    ngOnDestroy(): void {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }

    ngAfterViewInit(): void {
        this.views = {
            dayGridMonthCustom: {
                type: 'dayGridMonth',
                buttonText: this.getTranslate('tasks.calendar.month')
            }
        };

        this.drawer.open();

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

    getTranslate(word) {
        return this.translateService.instant(word);
    }

    ngAfterViewChecked() {
        let weekdayContainer = document.getElementsByClassName("holiday-date");
        if (!weekdayContainer.length) {
            this.taskCalendarService.setHolidayHighlight(this.holidays);
        }
    }
}
