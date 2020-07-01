import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class LoadingIndicatorService {
  private _loadingStatus: boolean = false;
  private loadingStatus = new BehaviorSubject(this._loadingStatus);
  public currentLoadingStatus = this.loadingStatus.asObservable();

  changeLoadingStatus(status: boolean) {
    this.loadingStatus.next(status);
  }
}
