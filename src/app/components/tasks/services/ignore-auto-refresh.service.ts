import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class IgnoreAutoRefreshService {
  private _autoRefresh = false;
  private autoRefresh = new BehaviorSubject(this._autoRefresh);
  public currentAutoRefresh = this.autoRefresh.asObservable();

  changeCurrentAutoRefresh(ignoreAutoRefresh: boolean): void {
    this.autoRefresh.next(ignoreAutoRefresh);
  }
}
