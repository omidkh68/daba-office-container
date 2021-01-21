import {Component, EventEmitter, Injector, Input, OnInit, Output} from '@angular/core';
import {AppConfig} from '../../../../environments/environment';
import {AddressService} from '../../web-browser/service/address.service';
import {LoginDataClass} from '../../../services/loginData.class';
import {ElectronService} from '../../../core/services';
import {UserInfoService} from '../../users/services/user-info.service';
import {ServiceInterface} from '../../services/logic/service-interface';
import {CompanyInterface} from '../../select-company/logic/company-interface';
import {WindowManagerService} from '../../../services/window-manager.service';
import {CompanySelectorService} from '../../select-company/services/company-selector.service';
import {SoftPhoneBottomSheetInterface} from '../soft-phone-bottom-sheet/logic/soft-phone-bottom-sheet.interface';

@Component({
  selector: 'app-soft-phone-settings',
  templateUrl: './soft-phone-settings.component.html',
  styleUrls: ['./soft-phone-settings.component.scss']
})
export class SoftPhoneSettingsComponent extends LoginDataClass implements OnInit {
  @Input()
  rtlDirection: boolean;

  @Input()
  tabId: number = 4;

  @Output()
  triggerBottomSheet: EventEmitter<SoftPhoneBottomSheetInterface> = new EventEmitter<SoftPhoneBottomSheetInterface>();

  url: string = '';

  constructor(private injector: Injector,
              private addressService: AddressService,
              private electronService: ElectronService,
              private userInfoService: UserInfoService,
              private windowManagerService: WindowManagerService,
              private companySelectorService: CompanySelectorService) {
    super(injector, userInfoService);
  }

  ngOnInit(): void {
    if (!this.isElectron) {
      const currentCompany: CompanyInterface = this.companySelectorService.currentCompany;

      this.url = AppConfig.PBX_LOGIN_EXTENSION + `/login.php?action=loginbytoken&comp_id=${currentCompany.id}&token=${this.loginData.access_token}`;
    }
  }

  openSoftphoneExtension() {
    const currentCompany: CompanyInterface = this.companySelectorService.currentCompany;

    let url = AppConfig.PBX_LOGIN_EXTENSION + `/login.php?action=loginbytoken&comp_id=${currentCompany.id}&token=${this.loginData.access_token}`;

    const service: ServiceInterface = this.windowManagerService.serviceList.filter(service => service.service_name === 'web_browser').pop();

    this.windowManagerService.openWindowState(service).then(() => {
      setTimeout(() => {
        this.windowManagerService.activeWindow(service);

        this.addressService.changeAddress({
          url: url,
          title: '',
          disabled: true
        });
      }, 500);
    });
  }

  get isElectron() {
    return this.electronService.isElectron;
  }
}
