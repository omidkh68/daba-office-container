import {Directive, HostListener, Input, Optional} from '@angular/core';

import {PopoverRef} from './popover-ref';

/**
 * Button that will close the current popover.
 */
@Directive({
  selector: '[p1PopoverClose]'
})
export class PopoverCloseDirective<T = any> {
  @Input('p1PopoverClose') popoverResult: T;

  constructor(
    @Optional() private popoverRef: PopoverRef<T>
  ) {
  }

  @HostListener('click') onClick(): void {
    if (!this.popoverRef) {
      console.error('p1PopoverClose is not supported within a template');

      return;
    }
    this.popoverRef.close(this.popoverResult);
  }
}
