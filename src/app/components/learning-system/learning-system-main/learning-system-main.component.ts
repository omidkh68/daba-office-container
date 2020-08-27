import {AfterViewInit, Component, ElementRef, Injector, OnDestroy, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs/internal/Subscription';
import {LoginDataClass} from '../../../services/loginData.class';
import {UserInfoService} from '../../users/services/user-info.service';
import {TranslateService} from '@ngx-translate/core';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../services/loading-indicator.service';

@Component({
  selector: 'app-learning-system-main',
  templateUrl: './learning-system-main.component.html',
  styleUrls: ['./learning-system-main.component.scss']
})
export class LearningSystemMainComponent extends LoginDataClass implements AfterViewInit, OnDestroy {
  @ViewChild('webFrame', {static: false}) webFrame: ElementRef;

  rtlDirection: boolean;
  loadingIndicator: LoadingIndicatorInterface = {status: false, serviceName: 'learningSystem'};

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private injector: Injector,
              private viewDirection: ViewDirectionService,
              private userInfoService: UserInfoService,
              private translateService: TranslateService,
              private loadingIndicatorService: LoadingIndicatorService) {
    super(injector, userInfoService);

    this._subscription.add(
      this.loadingIndicatorService.currentLoadingStatus.subscribe(status => this.loadingIndicator = status)
    );

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngAfterViewInit(): void {
    if (this.webFrame) {
      this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'learningSystem'});

      const address = `https://eis.enoox.com/`;

      this.webFrame.nativeElement.setAttribute('src', address);

      this.webFrame.nativeElement.addEventListener('did-stop-loading', () => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'learningSystem'});
      });
    }
  }

  getTranslate(word) {
    return this.translateService.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
