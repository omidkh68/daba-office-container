import {ChangeDetectorRef, Directive, HostBinding} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {PopoverRef} from './popover-ref';

/**
 * Internal directive that shows the popover arrow.
 */
@Directive({
  selector: '[popoverArrow]'
})
export class PopoverArrowDirective {
  @HostBinding('style.width.px')
  @HostBinding('style.height.px')
  arrowSize: number;

  @HostBinding('style.top.px')
  offsetTop: number;

  @HostBinding('style.right.px')
  offsetRight: number;

  @HostBinding('style.bottom.px')
  offsetBottom: number;

  @HostBinding('style.left.px')
  offsetLeft: number;

  private _subscription = new Subscription();

  constructor(private popoverRef: PopoverRef,
              private cd: ChangeDetectorRef) {
    this.arrowSize = popoverRef.config.arrowSize;

    this._subscription = popoverRef.positionChanges().subscribe(p => {
      const {offsetX, offsetY} = p.connectionPair;

      this.offsetTop = offsetY >= 0 ? offsetY * -1 : null;
      this.offsetLeft = offsetX < 0 ? offsetX * -1 : null;
      this.offsetBottom = offsetY < 0 ? offsetY : null;
      this.offsetRight = offsetX >= 0 ? offsetX : null;

      this.cd.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
