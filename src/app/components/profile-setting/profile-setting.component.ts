import {Component, Inject, Injector, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/internal/Observable';
import {Subscription} from 'rxjs/internal/Subscription';
import {map, startWith} from 'rxjs/operators';
import {LoginDataClass} from '../../services/loginData.class';
import {DatetimeService} from './logic/datetime.service';
import {UserInfoService} from '../users/services/user-info.service';
import {TranslateService} from '@ngx-translate/core';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {ViewDirectionService} from '../../services/view-direction.service';
import {ProfileSettingService} from './logic/profile-setting.service';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../services/loading-indicator.service';
import {ShowImageCropperComponent} from './show-image-cropper/show-image-cropper.component';
import {MessageService} from "../../services/message.service";
import {CheckLoginInterface} from "../login/logic/check-login.interface";

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
  activeTab: number = 0;
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

  constructor(private viewDirection: ViewDirectionService,
              private translate: TranslateService,
              public dialog: MatDialog,
              private fb: FormBuilder,
              private profileSettingService: ProfileSettingService,
              private loadingIndicatorService: LoadingIndicatorService,
              private injector: Injector,
              private userInfoService: UserInfoService,
              private datetimeService: DatetimeService,
              private messageService: MessageService,
              public dialogRef: MatDialogRef<ProfileSettingComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
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
        c_password: new FormControl(''),
        extension_no: new FormControl(''),
        timezone: new FormControl('', Validators.required),
        dark_mode: new FormControl(0),
        lang: new FormControl(this.rtlDirection ? 'fa' : 'en'),
      });
      resolve(true);
    });
  }

  formPatchValue() {
    this.defaultLang = this.loggedInUser.lang;

    this.selectDarkMode = this.loggedInUser.dark_mode;

    const newTimezone = {};
    const requestTimezone = this.loggedInUser.timezone;
    const tempTimezone = this.loggedInUser.timezone !== '' && this.loggedInUser.timezone !== null ? this.loggedInUser.timezone.split('/')[1] : '';

    newTimezone['city'] = tempTimezone;
    newTimezone['timezone'] = requestTimezone;

    this.form.patchValue({
      name: this.loggedInUser.name,
      email: this.loggedInUser.email,
      extension_no: this.loggedInUser.extension_no,
      timezone: newTimezone,
      dark_mode: this.loggedInUser.dark_mode,
      lang: this.loggedInUser.lang,
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

    this.userInfoService.changeDarkMode();
  }

  changeLang(language) {
    this.viewDirection.changeDirection(language.value === 'fa');

    this.form.get('lang').setValue(language.value);

    console.log(language.value);
  }

  onSubmit() {
    this.form.disable();
    this.profileSettingService.accessToken = this.loginData.token_type + ' ' + this.loginData.access_token;
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'changeLang'});

    const finalValue = {};

    finalValue['email'] = this.form.get('email').value;
    finalValue['name'] = this.form.get('name').value;
    finalValue['timezone'] = this.form.get('timezone').value.timezone;

    if (this.form.get('c_password').value.length) {
      finalValue['c_password'] = this.form.get('c_password').value;
    }

    if (this.form.get('extension_no').value.length) {
      finalValue['extension_no'] = this.form.get('extension_no').value;
    }

    finalValue['lang'] = this.form.get('lang').value;
    finalValue['dark_mode'] = this.form.get('dark_mode').value;

    this._subscription.add(
      this.profileSettingService.updateUser(finalValue, this.loggedInUser.id).subscribe((resp: CheckLoginInterface) => {

        if (resp.success) {
          this.form.enable();

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

    this._subscription.add(
      dialogRef.afterClosed().subscribe(() => {
        this.resetInput = '';
      })
    );
  }

  tabChange(event: MatTabChangeEvent) {
    this.activeTab = event.index;
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
