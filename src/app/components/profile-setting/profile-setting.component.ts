import {Component, Inject, Injector, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/internal/Observable';
import {Subscription} from 'rxjs/internal/Subscription';
import {map, startWith} from 'rxjs/operators';
import {LoginDataClass} from '../../services/loginData.class';
import {MessageService} from '../message/service/message.service';
import {UserInfoService} from '../users/services/user-info.service';
import {DatetimeService} from '../dashboard/dashboard-toolbar/time-area/service/datetime.service';
import {ElectronService} from '../../core/services';
import {TranslateService} from '@ngx-translate/core';
import {ApproveComponent} from '../approve/approve.component';
import {HttpErrorResponse} from '@angular/common/http';
import {CheckLoginInterface} from '../login/logic/check-login.interface';
import {RefreshLoginService} from '../login/services/refresh-login.service';
import {ViewDirectionService} from '../../services/view-direction.service';
import {WindowManagerService} from '../../services/window-manager.service';
import {ProfileSettingService} from './logic/profile-setting.service';
import {ShowImageCropperComponent} from './show-image-cropper/show-image-cropper.component';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../services/loading-indicator.service';

export interface Timezones {
  city: string;
  timezone: string;
}

export interface LangInterface {
  id: string;
  name: string;
}

@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.component.html',
  styleUrls: ['./profile-setting.component.scss']
})
export class ProfileSettingComponent extends LoginDataClass implements OnInit, OnDestroy {
  changeValueForm: boolean = false;
  viewModeTypes = 'information';
  resetInput;
  defaultLang;
  selectDarkMode;
  form: FormGroup;
  rtlDirection: boolean;
  loadingIndicator: LoadingIndicatorInterface = {status: false, serviceName: 'changeLang'};
  filteredOptions: Observable<any>;
  options;
  checkMoreClock: boolean;
  checkMoreClockContent: boolean;
  cityClocksList: Timezones[];
  langs: LangInterface[] = [
    {
      id: 'en',
      name: 'English'
    },
    {
      id: 'fa',
      name: 'پارسی'
    }
  ];

  private _subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<ProfileSettingComponent>,
              private fb: FormBuilder,
              private injector: Injector,
              private translate: TranslateService,
              private messageService: MessageService,
              private electronService: ElectronService,
              private userInfoService: UserInfoService,
              private datetimeService: DatetimeService,
              private viewDirection: ViewDirectionService,
              private refreshLoginService: RefreshLoginService,
              private windowManagerService: WindowManagerService,
              private profileSettingService: ProfileSettingService,
              private loadingIndicatorService: LoadingIndicatorService) {
    super(injector, userInfoService);

    this._subscription.add(
      this.loadingIndicatorService.currentLoadingStatus.subscribe(status => this.loadingIndicator = status)
    );

    this._subscription.add(
      this.userInfoService.currentUserInfo.subscribe(user => this.loggedInUser = user)
    );

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );

    this.checkMoreClock = false;
    this.options = datetimeService.timezones;
    this.cityClocksList = [{city: 'Tehran', timezone: 'Asia/Tehran'}];
  }

  ngOnInit(): void {
    this.createForm().then(() => this.formPatchValue());

    this.filteredOptions = this.form.get('timezone').valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this.filter(name) : this.options.slice())
    );

    this._subscription.add(
      this.form.valueChanges.subscribe(value => {
        this.changeValueForm = true;
      })
    );
  }

  changeViewMode(mode) {
    this.viewModeTypes = mode;
  }

  createForm() {
    return new Promise((resolve) => {
      this.form = this.fb.group({
        name: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        c_password: new FormControl(null),
        extension_no: new FormControl(''),
        timezone: new FormControl('', Validators.required),
        dark_mode: new FormControl(0),
        lang: new FormControl(this.rtlDirection ? 'fa' : 'en'),
      });
      resolve(true);
    });
  }

  formPatchValue() {
    if (this.loggedInUser.lang !== null) {
      this.defaultLang = this.loggedInUser.lang;
    }

    if (this.loggedInUser.dark_mode !== null) {
      this.selectDarkMode = this.loggedInUser.dark_mode;
    }

    const newTimezone = {};
    const requestTimezone = this.loggedInUser.timezone;

    newTimezone['city'] = this.loggedInUser.timezone !== '' && this.loggedInUser.timezone !== null ? this.loggedInUser.timezone.split('/')[1] : '';
    newTimezone['timezone'] = requestTimezone;

    this.form.patchValue({
      name: this.loggedInUser.name,
      email: this.loggedInUser.email,
      extension_no: this.loggedInUser.extension_no,
      timezone: newTimezone,
      dark_mode: this.loggedInUser.dark_mode,
      lang: this.loggedInUser.lang
    });

    this.changeValueForm = false;
  }

  close() {
    this.dialogRef.close();
  }

  displayFn(timezone: Timezones): string {
    return timezone && timezone.city ? timezone.city : '';
  }

  changeDarkMode($event) {
    this.form.get('dark_mode').setValue($event.target.checked ? 1 : 0);
  }

  changeLang(language) {
    this.form.get('lang').setValue(language.value);
  }

  onSubmit() {
    this.profileSettingService.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'changeLang'});

    const formValue: any = {};

    formValue['email'] = this.form.get('email').value;
    formValue['name'] = this.form.get('name').value;
    formValue['timezone'] = this.form.get('timezone').value.timezone;

    if (this.form.get('c_password').value !== null) {
      formValue['c_password'] = this.form.get('c_password').value;
    }

    if (this.form.get('extension_no').value !== null) {
      formValue['extension_no'] = this.form.get('extension_no').value;
    }

    formValue['lang'] = this.form.get('lang').value;
    formValue['dark_mode'] = this.form.get('dark_mode').value;

    const currentLang = this.viewDirection.getCurrentLang();
    const compareFormLangAndCurrentLang = formValue['lang'] !== currentLang;

    if (compareFormLangAndCurrentLang) {
      const dialogRef = this.dialog.open(ApproveComponent, {
        data: {
          title: this.getTranslate('profileSettings.change_lang_warning_note'),
          message: this.getTranslate('profileSettings.change_lang_warning_text')
        },
        autoFocus: false,
        width: '70vh',
        maxWidth: '350px',
        panelClass: 'approve-detail-dialog',
        height: '160px'
      });

      this.windowManagerService.dialogOnTop(dialogRef.id);

      this._subscription.add(
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.updateUser(formValue, compareFormLangAndCurrentLang);
          } else {
            this.defaultLang = currentLang;

            this.form.get('lang').setValue(currentLang);

            this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'changeLang'});
          }
        })
      );
    } else {
      this.updateUser(formValue, false);
    }
  }

  updateUser(formValue, hasReload: boolean) {
    this._subscription.add(
      this.profileSettingService.updateUser(formValue, this.loggedInUser.id).subscribe((resp: CheckLoginInterface) => {
        if (resp.success) {
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'changeLang'});

          if (resp.data.lang !== null) {
            this.defaultLang = resp.data.lang;

            this.windowManagerService.closeAllServices().then(() => {
              this.viewDirection.changeDirection(resp.data.lang === 'fa');
            });

            /*if (hasReload) {
              if (this.electronService.isElectron) {
                this.electronService.remote.app.relaunch();
                this.electronService.remote.app.exit(0);
              } else {
                location.reload();
              }
            }*/
          }

          if (resp.data.dark_mode !== null) {
            this.selectDarkMode = resp.data.dark_mode;
          }

          if (resp.data.dark_mode !== this.loggedInUser.dark_mode) {
            this.userInfoService.changeDarkMode();
          }

          let user = this.loggedInUser;

          const newUser = resp.data;

          user = {
            ...user,
            profile_image: newUser.profile_image,
            background_image: newUser.background_image,
            email: newUser.email,
            name: newUser.name,
            timezone: newUser.timezone,
            lang: newUser.lang,
            dark_mode: newUser.dark_mode,
            extension_no: newUser.extension_no,
            status: newUser.status
          };

          this.userInfoService.changeUserInfo(user);

          this.dialogRef.close();

          setTimeout(() => {
            const successfulMessage = this.getTranslate('profileSettings.profile_update');

            this.messageService.showMessage(successfulMessage, 'success');
          }, 200);
        } else {
          this.form.enable();
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'changeLang'});
        }

        this.changeValueForm = false;
      }, (error: HttpErrorResponse) => {
        this.form.enable();

        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'changeLang'});

        this.refreshLoginService.openLoginDialog(error);
      })
    );
  }

  setClockCity(option) {
    this.checkMoreClock = false;
    this.checkMoreClockContent = false;
    this.cityClocksList.push(option);
  }

  fileChangeEvent(event: any): void {
    this.showCropperImage(event);
  }

  showCropperImage(event) {
    const dialogRef = this.dialog.open(ShowImageCropperComponent, {
      data: {data: event},
      autoFocus: false,
      width: '900px',
      height: '615px',
      panelClass: 'status-dialog'
    });

    this.windowManagerService.dialogOnTop(dialogRef.id);

    this._subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        this.resetInput = '';

        if (result) {
          this.dialogRef.close();
        }
      })
    );
  }

  getTranslate(word) {
    return this.translate.instant(word);
  }

  filter(name: string): Timezones[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.city.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
