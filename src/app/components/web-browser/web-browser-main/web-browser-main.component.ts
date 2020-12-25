import {AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChildren} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs/internal/Subscription';
import {AddressService} from '../service/address.service';
import {ElectronService} from '../../../core/services';
import {TranslateService} from '@ngx-translate/core';
import {AddressInterface} from '../logic/address.interface';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../services/loading-indicator.service';

export interface UrlInterface {
  source: string;
  protocol: string;
  host: string;
  port: string;
  query: string;
  params: any;
  file: string;
  hash: string;
  path: string;
  relative: string;
  segments: string[];
}

@Component({
  selector: 'app-web-browser-main',
  templateUrl: './web-browser-main.component.html',
  styleUrls: ['./web-browser-main.component.scss']
})
export class WebBrowserMainComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('webFrame') webFrames: QueryList<ElementRef>;

  rtlDirection: boolean;
  addresses: Array<AddressInterface> = [
    {
      title: 'Google',
      url: 'https://www.google.com'
    }
  ];
  selectCurrentTab: number = 0;
  loadingIndicator: LoadingIndicatorInterface = null;

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private addressService: AddressService,
              private electronService: ElectronService,
              private translateService: TranslateService,
              private viewDirection: ViewDirectionService,
              private loadingIndicatorService: LoadingIndicatorService) {
    this._subscription.add(
      this.loadingIndicatorService.currentLoadingStatus.subscribe(status => this.loadingIndicator = status)
    );

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );

    this._subscription.add(
      this.addressService.currentAddress.subscribe(address => {
        if (address) {
          this.addresses.push(address);

          setTimeout(() => {
            this.getTabWebFrame(this.addresses.length - 1).then((webFrame: ElementRef) => {
              this.readyWebView(webFrame, address, address.url);

              this.selectCurrentTab = this.addresses.length - 1;
            });
          }, 200);
        }
      })
    );
  }

  ngAfterViewInit(): void {
    this.webFrames.map((webFrame: ElementRef, index) => {
      const findItem: AddressInterface = this.addresses[index];

      this.readyWebView(webFrame, findItem, this.addresses[index].url);
    });
  }

  getTabWebFrame(index: number): Promise<ElementRef> {
    return new Promise((resolve) => {
      this.webFrames.map((webFrame: ElementRef, i) => {
        if (index === i) {
          resolve(webFrame);
        }
      });
    });
  }

  enterAddress($event, index: number): void {
    const currentUrl = $event.target.value;

    const findItem = this.addresses[index];

    if ($event.key === 'Enter') {
      this.getTabWebFrame(index).then((webFrame: ElementRef) => {
        this.readyWebView(webFrame, findItem, currentUrl);
      });
    }
  }

  readyWebView(webFrame: ElementRef, findItem: AddressInterface, url): void {
    // let finalUrl = this.urlFixer(this.parseURL(url));

    let finalUrl = !(/(http(s?)):\/\//i.test(url)) ? 'http://' + url : url;

    webFrame.nativeElement.setAttribute('src', finalUrl);

    webFrame.nativeElement.addEventListener('did-start-loading', () => {
      this.electronService.remote.webContents.fromId(webFrame.nativeElement.getWebContentsId()).session.clearCache();

      this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'webBrowser'});
    });

    webFrame.nativeElement.addEventListener('did-stop-loading', () => {
      this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'webBrowser'});

      findItem.title = webFrame.nativeElement.getTitle();

      findItem.contentReady = true;

      findItem.webFrame = webFrame;
    });

    webFrame.nativeElement.addEventListener('page-favicon-updated', (event: any) => {
      if (event.favicons && event.favicons[0]) {
        findItem.favicon = event.favicons[0];
      }
    });

    webFrame.nativeElement.addEventListener('did-navigate', (event: any) => {
      findItem.url = event.url;
    });
  }

  reloadWebView(index: number): void {
    this.getTabWebFrame(index).then((webFrame: ElementRef) => {
      webFrame.nativeElement.reloadIgnoringCache();
    });
  }

  backwardWebView(index: number): void {
    this.getTabWebFrame(index).then((webFrame: ElementRef) => {
      webFrame.nativeElement.goBack();
    });
  }

  forwardWebView(index: number): void {
    this.getTabWebFrame(index).then((webFrame: ElementRef) => {
      webFrame.nativeElement.goForward();
    });
  }

  selectTab(address: AddressInterface, index: number): void {
    this.selectCurrentTab = index;

    this.getTabWebFrame(index).then((webFrame: ElementRef) => {
      if (address.contentReady) {
        address.title = webFrame.nativeElement.getTitle();
      }
    });
  }

  closeTab(index: number): void {
    this.addresses.splice(index, 1);

    if (!this.addresses.length) {
      this.addTab();
    }

    this.selectCurrentTab = this.addresses.length - 1;
  }

  addTab() {
    this.addresses.push({
      title: '',
      url: null,
      disabled: false,
      contentReady: false
    });

    this.selectCurrentTab = this.addresses.length - 1;
  }

  parseURL(url): UrlInterface {
    const a = document.createElement('a');
    a.href = url;
    return {
      source: url,
      protocol: a.protocol.replace(':', ''),
      host: a.hostname,
      port: a.port,
      query: a.search,
      params: (() => {
        let ret = {},
          seg = a.search.replace(/^\?/, '').split('&'),
          len = seg.length,
          i = 0,
          s;
        for (; i < len; i++) {
          if (!seg[i]) {
            continue;
          }
          s = seg[i].split('=');
          ret[s[0]] = s[1];
        }
        return ret;
      })(),
      file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
      hash: a.hash.replace('#', ''),
      path: a.pathname.replace(/^([^\/])/, '/$1'),
      relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
      segments: a.pathname.replace(/^\//, '').split('/')
    };
  }

  urlFixer(urlParams: UrlInterface): string {
    let url = urlParams.protocol + '://' + urlParams.host;

    if (urlParams.port.length) {
      url += urlParams.port;
    }

    if (urlParams.path.length) {
      url += urlParams.path;
    }

    if (urlParams.file.length) {
      url += urlParams.file;
    }

    if (urlParams.query.length) {
      url += urlParams.query;
    }

    if (urlParams.hash.length) {
      url += '#' + urlParams.query;
    }

    return url;
  }

  getTranslate(word): string {
    return this.translateService.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
