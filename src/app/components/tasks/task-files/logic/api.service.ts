import {HttpRequest, HttpClient, HttpEvent, HttpEventType, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {map} from 'rxjs/operators';
import {FilePickerAdapter, FilePreviewModel} from 'ngx-awesome-uploader';
import {AppConfig} from '../../../../../environments/environment';

export class ApiService extends FilePickerAdapter {
  private API_URL = AppConfig.API_URL;

  /**
   * @type {HttpHeaders}
   */
  private headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8',
      'Accept': 'application/json; charset=UTF-8'
    })
  };

  constructor(private _http: HttpClient) {
    super();
  }

  public uploadFile(fileItem: FilePreviewModel) {
    const form = new FormData();

    form.append('file', fileItem.file);

    const req = new HttpRequest('POST', `${this.API_URL}/boards/task/file`, form, {reportProgress: true});

    return this._http.request(req)
      .pipe(
        map((res: HttpEvent<any>) => {
          if (res.type === HttpEventType.Response) {
            return res.body.id.toString();
          } else if (res.type === HttpEventType.UploadProgress) {
            // Compute and show the % done:
            const UploadProgress = +Math.round((100 * res.loaded) / res.total);
            return UploadProgress;
          }
        })
      );
  }

  public removeFile(fileItem): Observable<any> {
    return this._http.post(`${this.API_URL}`, {});
  }
}
