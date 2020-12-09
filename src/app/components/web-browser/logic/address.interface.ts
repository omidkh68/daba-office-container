import {ElementRef} from '@angular/core';

export interface AddressInterface {
  url: string;
  title?: string;
  disabled?: boolean;
  webFrame?: ElementRef;
  contentReady?: boolean;
  favicon?: string;
}
