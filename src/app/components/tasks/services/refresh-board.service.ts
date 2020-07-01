import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class RefreshBoardService {
  private _doRefresh: boolean = false;

  // set observable behavior to property
  private doRefresh = new BehaviorSubject(this._doRefresh);

  // observable property
  public currentDoRefresh = this.doRefresh.asObservable();

  changeCurrentDoRefresh(doRefresh: boolean) {
    this.doRefresh.next(doRefresh);

    if (doRefresh) {
      setTimeout(() => this.changeCurrentDoRefresh(false), 500);
    }
  }
}
