import {
    AfterViewInit,
    Component,
    Input,
    Renderer2,
} from '@angular/core';

@Component({
    selector: 'app-time-area-digital-clock',
    templateUrl: './time-area-digital-clock.component.html',
    styleUrls: ['./time-area-digital-clock.component.scss']
})
export class TimeAreaDigitalClockComponent implements AfterViewInit {

    @Input()
    timezone: string;

    time: string;

    constructor(private render: Renderer2) {

    }

    init = () => {
        setInterval(() => {
            this.time = new Date().toLocaleTimeString("en-US", {timeZone: this.timezone, hour12: false});
        }, 1000);
    }


    ngAfterViewInit(): void {
        this.init();
    }

}
