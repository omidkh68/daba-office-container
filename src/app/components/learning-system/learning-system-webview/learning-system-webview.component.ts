import {AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {WebViewService} from '../service/web-view.service';
import {ElectronService} from '../../../core/services';
import {RefreshInterface} from '../logic/refresh.interface';
import {LoadingIndicatorService} from '../../../services/loading-indicator.service';

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
          if (this.isElectron) {
            this.webFrame.nativeElement.reloadIgnoringCache();
          } else {
            const src = this.webFrame.nativeElement.getAttribute('src');

            this.webFrame.nativeElement.setAttribute('src', '');

            const rndTime = Date.now();

            setTimeout(() => {
              this.webFrame.nativeElement.setAttribute('src', src + `&var=${rndTime}`);
            }, 500);
          }
        }
      })
    );
  }

  ngAfterViewInit(): void {
    if (this.webFrame) {
      const rndTime = Date.now();

      this.webFrame.nativeElement.setAttribute('src', this.frameUrl + `&var=${rndTime}`);

      if (this.isElectron) {
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
  }

  get isElectron() {
    return this.electronService.isElectron;
  }

  ngOnDestroy(): void {
    this.webViewService.changeRefreshWebView({doRefresh: false, visible: false});

    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
