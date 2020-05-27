import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Input,
  Renderer2, Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {BottomSheetInterface} from './logic/bottomSheet.interface';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.scss']
})
export class BottomSheetComponent {
  @ViewChild('oBottomSheet') oBottomSheet: ElementRef;
  @ViewChild('container', {read: ViewContainerRef}) container;

  constructor(private renderer: Renderer2,
              private cfr: ComponentFactoryResolver) {
  }

  toggleBottomSheet(bottomSheetConfig: BottomSheetInterface, toggle: boolean = true) {
    this.container.clear();

    const parentNode = this.oBottomSheet.nativeElement.parentNode.parentNode;
    const el = this.oBottomSheet.nativeElement;

    if (toggle) {
      this.renderer.addClass(parentNode, 'active');
      this.renderer.setStyle(el, 'height', bottomSheetConfig.height);
      this.renderer.setStyle(parentNode, 'z-index', '5');

      const compInstance = this.cfr.resolveComponentFactory(bottomSheetConfig.component);
      const bottomSheetInstance = this.cfr.resolveComponentFactory(BottomSheetComponent);

      console.log(compInstance, bottomSheetInstance);

      const ref = this.container.createComponent(compInstance);

      ref.instance.bottomSheetData = {...bottomSheetConfig, bottomSheetRef: bottomSheetInstance};
    } else {
      this.renderer.removeClass(parentNode, 'active');
      this.renderer.setStyle(el, 'height', '0');

      setTimeout(() => {
        this.renderer.setStyle(parentNode, 'z-index', '-1');
      }, 100);
    }
  }

  close() {
    this.toggleBottomSheet(null, false);
  }
}
