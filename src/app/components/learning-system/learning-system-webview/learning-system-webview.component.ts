import {AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {WebViewService} from '../service/web-view.service';
import {ElectronService} from '../../../services/electron.service';
import {LoadingIndicatorService} from '../../../services/loading-indicator.service';
import {RefreshInterface} from '../logic/refresh.interface';

@Component({
  selector: 'app-learning-system-webview',
  templateUrl: './learning-system-webview.component.html',
  styles: [
    `
    :host {
      position: absolute;
      right: 0;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
    }
    `
  ]
})
export class LearningSystemWebviewComponent implements AfterViewInit, OnDestroy {
  @Input()
  showFrame;

  @Input()
  frameUrl;

  @ViewChild('webFrame', {static: false}) webFrame: ElementRef;

  reloadWebView: RefreshInterface;

  private _subscription: Subscription = new Subscription();

  constructor(private webViewService: WebViewService,
              private electronService: ElectronService,
              private loadingIndicatorService: LoadingIndicatorService) {
    this._subscription.add(
      this.webViewService.currentRefreshWebView.subscribe(status => {
        this.reloadWebView = status;

        if (this.reloadWebView && this.reloadWebView.doRefresh && this.webFrame) {
          this.webFrame.nativeElement.reloadIgnoringCache();
        }
      })
    );
  }

  ngAfterViewInit(): void {
    if (this.webFrame) {

      this.webFrame.nativeElement.setAttribute('src', this.frameUrl);

      this.webFrame.nativeElement.addEventListener('did-start-loading', () => {
        this.electronService.remote.webContents.fromId(this.webFrame.nativeElement.getWebContentsId()).session.clearCache();

        this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'learningSystem'});
      });

      this.webFrame.nativeElement.addEventListener('did-stop-loading', () => {
        this.webViewService.changeRefreshWebView({doRefresh: false, visible: true});

        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'learningSystem'});
      });
    }
  }

  ngOnDestroy(): void {
    this.webViewService.changeRefreshWebView({doRefresh: false, visible: false});
  }
}
