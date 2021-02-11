import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class RefreshBoardService {
  private _doRefresh = false;
  private doRefresh = new BehaviorSubject(this._doRefresh);
  public currentDoRefresh = this.doRefresh.asObservable();

  changeCurrentDoRefresh(doRefresh: boolean): void {
    this.doRefresh.next(doRefresh);

    if (doRefresh) {
      setTimeout(() => this.changeCurrentDoRefresh(false), 500);
    }
  }
}
