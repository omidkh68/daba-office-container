import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from './logic/api.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-task-files',
  templateUrl: './task-files.component.html'
})
export class TaskFilesComponent implements OnInit {
  @Input()
  rtlDirection: boolean;

  adapter = new ApiService(this._http);
  fileUploaderCaption = {
    dropzone: {
      title: 'فایل رو بکش و بنداز اینجا',
      or: 'یا',
      browse: 'روی این دکمه بزن',
    }
  };

  constructor(private _http: HttpClient) {
  }

  ngOnInit(): void {
  }

}
