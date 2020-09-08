import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {SoftPhoneService} from '../service/soft-phone.service';
import {SoftPhoneBottomSheetInterface} from './logic/soft-phone-bottom-sheet.interface';

@Component({
  selector: 'app-soft-phone-bottom-sheet',
  templateUrl: './soft-phone-bottom-sheet.component.html',
  styleUrls: ['./soft-phone-bottom-sheet.component.scss']
})
export class SoftPhoneBottomSheetComponent {
  @ViewChild('oBottomSheet') oBottomSheet: ElementRef;
  @ViewChild('container', {read: ViewContainerRef}) container;

  minimizeStatus: boolean = false;

  private _subscription: Subscription = new Subscription();

  constructor(private cfr: ComponentFactoryResolver,
              private renderer: Renderer2,
              private softPhoneService: SoftPhoneService) {
    this._subscription.add(
      this.softPhoneService.currentMinimizeCallPopUp.subscribe(status => {
        this.minimizeStatus = status;

        try {
          const parentNode = this.oBottomSheet.nativeElement.parentNode.parentNode;

          if (this.minimizeStatus) {
            this.renderer.addClass(parentNode, 'minimizePopUp');
          } else {
            this.renderer.removeClass(parentNode, 'minimizePopUp');
          }
        } catch (e) {

        }
      })
    );
  }

  toggleBottomSheet(bottomSheetConfig: SoftPhoneBottomSheetInterface, toggle: boolean = true) {
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

  close() {
    this.toggleBottomSheet(null, false);
  }
}
