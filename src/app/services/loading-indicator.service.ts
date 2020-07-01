import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';

export interface LoadingIndicatorInterface {
  status: boolean;
  serviceName: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoadingIndicatorService {
  private _loadingStatus: LoadingIndicatorInterface = {status: false, serviceName: ''};
  private loadingStatus = new BehaviorSubject(this._loadingStatus);
  public currentLoadingStatus = this.loadingStatus.asObservable();

  changeLoadingStatus(status: LoadingIndicatorInterface) {
    this.loadingStatus.next(status);
  }
}
