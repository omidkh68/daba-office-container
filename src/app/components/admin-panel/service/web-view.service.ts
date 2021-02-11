import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class WebViewService {
  private _refreshWebView = false;
  private refreshWebView = new BehaviorSubject(this._refreshWebView);
  public currentRefreshWebView = this.refreshWebView.asObservable();

  constructor() {
  }

  changeRefreshWebView(status: boolean) {
    this.refreshWebView.next(status);

    if (status) {
      setTimeout(() => {
        this.changeRefreshWebView(false);
      }, 500);
    }
  }
}
