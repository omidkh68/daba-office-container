import {AfterViewInit, Component, Injector, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/internal/Observable';
import {Subscription} from 'rxjs/internal/Subscription';
import {map, startWith} from 'rxjs/operators';
import {LoginDataClass} from '../../services/loginData.class';
import {DatetimeService} from './logic/datetime.service';
import {UserInfoService} from '../users/services/user-info.service';
import {TranslateService} from '@ngx-translate/core';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {HttpErrorResponse} from '@angular/common/http';
import {ViewDirectionService} from '../../services/view-direction.service';
import {ProfileSettingService} from './logic/profile-setting.service';
import {UserContainerInterface} from '../users/logic/user-container.interface';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../services/loading-indicator.service';
import {ShowImageCropperComponent} from './show-image-cropper/show-image-cropper.component';

export interface Timezones {
  city: string;
  timezone: string;
}

@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.component.html',
  styleUrls: ['./profile-setting.component.scss']
})
export class ProfileSettingComponent extends LoginDataClass implements OnInit, AfterViewInit {

  tabs = [];
  form: FormGroup;
  activeTab: number = 0;
  rtlDirection: boolean;
  editable: boolean = false;
  loadingIndicator: LoadingIndicatorInterface = {status: false, serviceName: 'changeLang'};
  /*timezone*/
  filteredOptions: Observable<any>;
  myControl = new FormControl();
  options;
  checkMoreClock: boolean;
  checkMoreClockContent: boolean;
  cityClocksList: Timezones[];
  private _subscription: Subscription = new Subscription();

  /*timezone*/

  constructor(private viewDirection: ViewDirectionService,
              private translate: TranslateService,
              public dialog: MatDialog,
              private fb: FormBuilder,
              private profileSettingService: ProfileSettingService,
              private loadingIndicatorService: LoadingIndicatorService,
              private injector: Injector,
              private userInfoService: UserInfoService,
              private datetimeService: DatetimeService) {
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

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.tabs = [
        {
          name: this.getTranslate('profileSettings.profile_information'),
          icon: 'person',
          id: 'information'
        },
        {
          name: this.getTranslate('profileSettings.profile_wallpaper'),
          icon: 'palette',
          id: 'wallpaper'
        }
      ];
    }, 200);
  }

  displayFn(timezone: Timezones): string {
    return timezone && timezone.city ? timezone.city : '';
  }

  changeDarkMode($event) {
    this.form.get('dark_mode').setValue($event.target.checked ? 1 : 0);

    this.userInfoService.changeDarkMode();
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
    this.form.disable();
    this.editable = false;

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

  editableForm() {
    this.editable = !this.editable;

    if (this.editable) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }

  cancelBtn() {
    this.form.disable();

    this.formPatchValue();
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


    finalValue['lang'] = this.loggedInUser.lang;
    finalValue['dark_mode'] = this.loggedInUser.dark_mode;


    this._subscription.add(
      this.profileSettingService.updateUser(finalValue, this.loggedInUser.id).subscribe((resp: UserContainerInterface) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'changeLang'});
        this.editableForm();

        /*if (resp.result) {
          this.bottomSheetData.bottomSheetRef.close();

          this.messageService.showMessage(resp.message);

          this.refreshBoardService.changeCurrentDoRefresh(true);
        } else {
          this.form.enable();
        }*/
      }, (error: HttpErrorResponse) => {
        this.form.enable();

        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'changeLang'});

        /*this.refreshLoginService.openLoginDialog(error);*/
      })
    );
    /*if (this.dialogData.action === 'addUser') {
      const finalValue = this.form.value;
      finalValue.c_password = this.form.get('password').value;
      finalValue.timezone = this.form.get('timezone').value.timezone;
      this._subscription.add(
        this._hrManagementService.addUser(finalValue).subscribe((resp: any) => {
            if (resp.status === 200) {
              this.overlayLoading = false;
              this.form.enable();

              this.showMessage(0, resp.body.msg);
              this.dialogRef.close(resp);
            }
          },
          error => {
            this.overlayLoading = false;
            this.form.enable();

            const objectKeys = Object.keys(error.error.error);
            objectKeys.forEach(obj => {
              error.error.error[obj].forEach(val => {
                this.showMessage(1, val);
              });
            });

            if (error.status === 401) {
              this.userInfoService.changeLoginData('');
              this._router.navigateByUrl(`/login`);
            }
          }
        )
      );
    } else if (this.dialogData.action === 'editUser') {
      const finalValue = this.form.value;
      finalValue.c_password = this.form.get('password').value;
      finalValue.timezone = this.form.get('timezone').value.timezone;

      this._subscription.add(
        this._hrManagementService.updateUser(this.form.value, this.dialogData.data.id).subscribe((resp: any) => {
            if (resp.status === 200) {
              this.overlayLoading = false;
              this.form.enable();

              this.showMessage(0, resp.body.msg);
              this.dialogRef.close(resp);
            }
          },
          error => {
            this.overlayLoading = false;
            this.form.enable();
            this.showMessage(1, error.error.msg);

            if (error.status === 401) {
              this.userInfoService.changeLoginData('');
              this._router.navigateByUrl(`/login`);
            }
          }
        )
      );
    }*/
  }

  changeLang(language) {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'changeLang'});

    this.viewDirection.changeDirection(language === true);

    setTimeout(() => {
      window.location.reload();

    }, 500);
  }

  setClockCity(option) {
    this.checkMoreClock = false;
    this.checkMoreClockContent = false;
    this.cityClocksList.push(option);
  }

  showCropperImage() {
    const dialogRef = this.dialog.open(ShowImageCropperComponent, {
      autoFocus: false,
      width: '900px',
      height: '600px',
      panelClass: 'status-dialog'
    });

    this._subscription.add(
      dialogRef.afterClosed().subscribe((resp: any) => {
        if (resp) {
          // this.messageService.showMessage(`${resp.message}`);
        }
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
