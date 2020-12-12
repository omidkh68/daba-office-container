import {Component, EventEmitter, Injector, Input, OnDestroy, OnInit, Output} from '@angular/core';
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
import {CompanySelectorService} from '../../select-company/services/company-selector.service';
import {LoadingIndicatorService} from '../../../services/loading-indicator.service';
import {SoftPhoneBottomSheetInterface} from '../soft-phone-bottom-sheet/logic/soft-phone-bottom-sheet.interface';
import {CompanyInterface} from '../../select-company/logic/company-interface';
import {LoginDataClass} from "../../../services/loginData.class";
import {UserInfoService} from "../../users/services/user-info.service";

export interface CdrExtensionListInterface {
  src: string;
  dst: string;
  icon: string;
  color: string;
  date: string;
  user?: SoftphoneUserInterface;
  desc: string;
}

@Component({
  selector: 'app-soft-phone-logs',
  templateUrl: './soft-phone-logs.component.html',
  styleUrls: ['./soft-phone-logs.component.scss']
})
export class SoftPhoneLogsComponent extends LoginDataClass implements OnInit, OnDestroy {
  @Output()
  triggerBottomSheet: EventEmitter<SoftPhoneBottomSheetInterface> = new EventEmitter<SoftPhoneBottomSheetInterface>();

  @Input()
  rtlDirection: boolean;

  @Input()
  tabId: number = 2;

  @Input()
  softPhoneUsers: Array<SoftphoneUserInterface>;

  loggedInUserExtension: string = '';
  cdrList: Array<CdrInterface> = [];
  callPopUpMinimizeStatus: boolean = false;
  cdrExtensionList: Array<CdrExtensionListInterface> = [];

  private _subscription: Subscription = new Subscription();

  constructor(private api: ApiService,
              private injector: Injector,
              private userInfoService: UserInfoService,
              private softPhoneService: SoftPhoneService,
              private refreshLoginService: RefreshLoginService,
              private companySelectorService: CompanySelectorService,
              private loadingIndicatorService: LoadingIndicatorService) {
    super(injector, userInfoService);
    this._subscription.add(
      this.softPhoneService.currentMinimizeCallPopUp.subscribe(status => this.callPopUpMinimizeStatus = status)
    );

    this._subscription.add(
      this.softPhoneService.currentExtensionList.subscribe((ext: Array<ExtensionInterface>) => {
        if (ext && ext.length) {
          setTimeout(() => {
            this.loggedInUserExtension = ext.filter(item => item.username === this.loggedInUser.email).pop().extension_no;
          });
        }
      })
    );

    this._subscription.add(
      this.softPhoneService.currentActiveTab.subscribe(tab => tab === 2 ? this.getCdr() : null)
    );
  }

  ngOnInit(): void {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'pbx'});

    setTimeout(() => this.getCdr());
  }

  getCdr() {
    const currentCompany: CompanyInterface = this.companySelectorService.currentCompany;

    this._subscription.add(
      this.api.getCdr(this.loggedInUserExtension).subscribe((resp: CdrResultInterface) => {

        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'pbx'});

        if (resp.success && resp.data.length) {
          this.cdrList = resp.data; // todo: replace list with data in production

          this.cdrList.map(item => {
            let cdrExtensionItem: CdrExtensionListInterface = null;
            let findUser: SoftphoneUserInterface = null;
            let src = item.src.replace(`-${currentCompany.subdomain}`, '');

            if (this.loggedInUserExtension === item.dst) {
              findUser = this.softPhoneUsers.filter(user => user.extension_no === src).pop();

              let desc = '';
              let color = '';

              switch (item.disposition) {
                case 'NO ANSWER': {
                  desc = 'soft_phone.call_logs.missed_call';
                  color = 'text-red-500';

                  break;
                }

                case 'BUSY': {
                  desc = 'soft_phone.call_logs.rejected';
                  color = 'text-orange-600';

                  break;
                }

                case 'ANSWERED': {
                  desc = 'soft_phone.call_logs.answered';
                  color = 'text-green-500';

                  break;
                }
              }

              cdrExtensionItem = {
                src: src,
                dst: item.dst,
                icon: item.disposition === 'NO ANSWER' ? 'phone_missed' : 'phone_callback',
                date: item.calldate,
                color: color,
                desc: desc
              };

            } else if (this.loggedInUserExtension === src) {
              findUser = this.softPhoneUsers.filter(user => user.extension_no === item.dst).pop();

              let desc = '';
              let color = '';

              switch (item.disposition) {
                case 'NO ANSWER': {
                  desc = 'soft_phone.call_logs.not_answered';
                  color = 'text-red-500';

                  break;
                }

                case 'BUSY': {
                  desc = 'soft_phone.call_logs.busy';
                  color = 'text-orange-600';

                  break;
                }

                case 'ANSWERED': {
                  desc = 'soft_phone.call_logs.answered';
                  color = 'text-green-500';

                  break;
                }
              }

              cdrExtensionItem = {
                src: item.dst,
                dst: src,
                icon: 'phone_forwarded',
                date: item.calldate,
                color: color,
                desc: desc
              };
            }

            if (findUser) {
              cdrExtensionItem = {...cdrExtensionItem, user: findUser};

              this.cdrExtensionList.push(cdrExtensionItem);
            } else {
              this.cdrExtensionList.push(cdrExtensionItem);
            }
          });
        }
      }, (error: HttpErrorResponse) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'pbx'});

        this.refreshLoginService.openLoginDialog(error);
      })
    );
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
