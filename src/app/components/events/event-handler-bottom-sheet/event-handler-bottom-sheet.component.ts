import {Component, ComponentFactoryResolver, ElementRef, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {EventHandlerBottomSheetInterface} from "../logic/event-handler-data.interface";

@Component({
    selector: 'app-event-handler-bottom-sheet',
    templateUrl: './event-handler-bottom-sheet.component.html',
    styleUrls: ['./event-handler-bottom-sheet.component.scss']
})
export class EventHandlerBottomSheetComponent {
    @ViewChild('oBottomSheet') oBottomSheet: ElementRef;
    @ViewChild('container', {read: ViewContainerRef}) container;

    constructor(private renderer: Renderer2,
                private cfr: ComponentFactoryResolver) {
    }

    toggleBottomSheet(bottomSheetConfig: EventHandlerBottomSheetInterface, toggle: boolean = true) {
        this.container.clear();

        const parentNode = this.oBottomSheet.nativeElement.parentNode.parentNode;
        const el = this.oBottomSheet.nativeElement;

        if (toggle) {
            this.renderer.addClass(parentNode, 'active');
            this.renderer.setStyle(el, 'height', bottomSheetConfig.height);
            this.renderer.setStyle(el, 'width', bottomSheetConfig.width);
            this.renderer.setStyle(parentNode, 'z-index', '5');

            const compInstance = this.cfr.resolveComponentFactory(bottomSheetConfig.component);

            const ref = this.container.createComponent(compInstance);

            ref.instance.bottomSheetData = bottomSheetConfig;
        } else {
            this.renderer.removeClass(parentNode, 'active');
            this.renderer.setStyle(el, 'height', '0');
            this.renderer.setStyle(el, 'width', '0');

            setTimeout(() => this.renderer.setStyle(parentNode, 'z-index', '-1'), 100);
        }
    }

    close(data?: any) {
        this.toggleBottomSheet(null, false);
    }
}
