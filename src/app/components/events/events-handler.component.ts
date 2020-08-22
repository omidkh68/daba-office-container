import {AfterViewInit, Component, Inject, ViewChild, ViewContainerRef, ViewEncapsulation} from '@angular/core';
import {LazyComponentService} from '../../services/lazy-component.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ServiceItemsInterface} from '../dashboard/logic/service-items.interface';

@Component({
    selector: 'app-events-handler',
    styleUrls: ['./events-handler.component.scss'],
    templateUrl: './events-handler.component.html',
    encapsulation: ViewEncapsulation.None
})
export class EventsHandlerComponent implements AfterViewInit {
    @ViewChild('container', {read: ViewContainerRef}) container;

    width: number = 0;
    height: number = 0;

    constructor(private lazyComponentService: LazyComponentService,
                @Inject(MAT_DIALOG_DATA) public data: ServiceItemsInterface) {
    }

    async ngAfterViewInit() {
        const ref = this.lazyComponentService.loadComponent('eventsHandlerModuleId', this.container);

        ref.then(result => {
            result.instance.data = this.data;
        });
    }
}
