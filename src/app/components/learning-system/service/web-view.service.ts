import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {RefreshInterface} from '../logic/refresh.interface';

@Injectable({
  providedIn: 'root'
})
export class WebViewService {
  private _refreshWebView: RefreshInterface | null = null;
  private refreshWebView = new BehaviorSubject(this._refreshWebView);
  public currentRefreshWebView = this.refreshWebView.asObservable();

  constructor() {
  }

  changeRefreshWebView(status: RefreshInterface | null) {
    this.refreshWebView.next(status);

    if (status.doRefresh) {
      setTimeout(() => this.changeRefreshWebView({visible: true, doRefresh: false}), 500);
    }
  }
}
