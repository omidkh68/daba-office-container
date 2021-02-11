import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImageCropperComponent} from './image-cropper/image-cropper.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ImageCropperComponent
  ],
  exports: [
    ImageCropperComponent
  ]
})
export class ImageCropperModule {
}
