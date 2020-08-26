import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from './logic/api.service';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-task-files',
  templateUrl: './task-files.component.html'
})
export class TaskFilesComponent implements OnInit {
  @Input()
  rtlDirection: boolean;

  adapter = new ApiService(this.http);
  fileUploaderCaption = {};

  constructor(private http: HttpClient,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.fileUploaderCaption = {
      dropzone: {
        title: this.getTranslate('tasks.task_files.drop_files_here'),
        or: this.getTranslate('tasks.task_files.or'),
        browse: this.getTranslate('tasks.task_files.click_here'),
      }
    };
  }

  getTranslate(word) {
    return this.translate.instant(word);
  }
}
