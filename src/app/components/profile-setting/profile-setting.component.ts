import {Component, Inject, Injector, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/internal/Observable';
import {Subscription} from 'rxjs/internal/Subscription';
import {map, startWith} from 'rxjs/operators';
import {LoginDataClass} from '../../services/loginData.class';
import {MessageService} from '../../services/message.service';
import {DatetimeService} from './logic/datetime.service';
import {UserInfoService} from '../users/services/user-info.service';
import {TranslateService} from '@ngx-translate/core';
import {CheckLoginInterface} from '../login/logic/check-login.interface';
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
export class ProfileSettingComponent extends LoginDataClass implements OnInit {
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
              private viewDirection: ViewDirectionService,
              private messageService: MessageService,
              private userInfoService: UserInfoService,
              private datetimeService: DatetimeService,
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
    this.options = datetimeService.aryIannaTimeZones;
    this.cityClocksList = [{city: 'Tehran', timezone: 'Asia/Tehran'}];
  }

  ngOnInit(): void {
    this.createForm().then(() => {
      this.formPatchValue();
    });

    this.filteredOptions = this.form.get('timezone').valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this.filter(name) : this.options.slice())
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
    // this.form.valueChanges.subscribe()


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
    this.form.disable();
    this.profileSettingService.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'changeLang'});

    const finalValue = {};

    finalValue['email'] = this.form.get('email').value;
    finalValue['name'] = this.form.get('name').value;
    finalValue['timezone'] = this.form.get('timezone').value.timezone;

    if (this.form.get('c_password').value !== null) {
      finalValue['c_password'] = this.form.get('c_password').value;
    }

    if (this.form.get('extension_no').value !== null) {
      finalValue['extension_no'] = this.form.get('extension_no').value;
    }

    finalValue['lang'] = this.form.get('lang').value;
    finalValue['dark_mode'] = this.form.get('dark_mode').value;

    this._subscription.add(
      this.profileSettingService.updateUser(finalValue, this.loggedInUser.id).subscribe((resp: CheckLoginInterface) => {

        if (resp.success) {
          this.form.enable();

          this.viewDirection.changeDirection(resp.data.lang === 'fa');

          this.userInfoService.changeDarkMode();

          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'changeLang'});

          const successfulMessage = this.getTranslate('profileSettings.profile_update');

          this.messageService.showMessage(successfulMessage, 'success');

        } else {
          this.form.enable();
          this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'changeLang'});

        }
      }, () => {
        this.form.enable();
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'changeLang'});
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
      height: '600px',
      panelClass: 'status-dialog'
    });

    this.windowManagerService.dialogOnTop(dialogRef.id);

    this._subscription.add(
      dialogRef.afterClosed().subscribe(() => {
        this.resetInput = '';
      })
    );
  }

  getTranslate(word) {
    return this.translate.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  filter(name: string): Timezones[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.city.toLowerCase().indexOf(filterValue) === 0);
  }
}
