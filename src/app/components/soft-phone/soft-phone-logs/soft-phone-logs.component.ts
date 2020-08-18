import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {ApiService} from '../logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {CdrInterface} from '../logic/cdr.interface';
import {SoftPhoneService} from '../service/soft-phone.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ExtensionInterface} from '../logic/extension.interface';
import {CdrResultInterface} from '../logic/cdr-result.interface';
import {RefreshLoginService} from '../../login/services/refresh-login.service';
import {SoftphoneUserInterface} from '../logic/softphone-user.interface';
import {UserContainerInterface} from '../../users/logic/user-container.interface';
import {LoadingIndicatorService} from '../../../services/loading-indicator.service';
import {SoftPhoneBottomSheetInterface} from '../soft-phone-bottom-sheet/logic/soft-phone-bottom-sheet.interface';
import {SoftPhoneCallToActionComponent} from '../soft-phone-call-to-action/soft-phone-call-to-action.component';

@Component({
  selector: 'app-soft-phone-logs',
  templateUrl: './soft-phone-logs.component.html',
  styleUrls: ['./soft-phone-logs.component.scss']
})
export class SoftPhoneLogsComponent implements AfterViewInit {
  @Output()
  triggerBottomSheet: EventEmitter<SoftPhoneBottomSheetInterface> = new EventEmitter<SoftPhoneBottomSheetInterface>();

  @Input()
  rtlDirection: boolean;

  @Input()
  softPhoneUsers: Array<SoftphoneUserInterface>;

  @Input()
  loggedInUser: UserContainerInterface;

  loggedInUserExtension: string = '';
  cdrList: Array<CdrInterface> = [];
  callPopUpMinimizeStatus: boolean = false;

  private _subscription: Subscription = new Subscription();

  constructor(private api: ApiService,
              private softPhoneService: SoftPhoneService,
              private refreshLoginService: RefreshLoginService,
              private loadingIndicatorService: LoadingIndicatorService) {
    this._subscription.add(
      this.softPhoneService.currentMinimizeCallPopUp.subscribe(status => this.callPopUpMinimizeStatus = status)
    );
  }

  openSheet(user: SoftphoneUserInterface) {
    this.triggerBottomSheet.emit({
      component: SoftPhoneCallToActionComponent,
      height: '200px',
      width: '98%',
      data: user
    });
  }

  ngAfterViewInit(): void {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'pbx'});

    this._subscription.add(
      this.softPhoneService.currentExtensionList.subscribe((ext: Array<ExtensionInterface>) => {
        this.loggedInUserExtension = ext.filter(item => item.username === this.loggedInUser.email).pop().extension_no;

        this._subscription.add(
          this.api.getCdr(this.loggedInUserExtension).subscribe((resp: CdrResultInterface) => {

            this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'pbx'});

            if (resp.success && resp.data.length) {
              this.cdrList = resp.data;
            }
          }, (error: HttpErrorResponse) => {
            this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'pbx'});

            this.refreshLoginService.openLoginDialog(error);
          })
        );
      })
    );
  }
}
