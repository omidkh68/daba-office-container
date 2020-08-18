import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Subscription} from "rxjs/internal/Subscription";
import {ViewDirectionService} from "../../services/view-direction.service";
import {MatTabChangeEvent} from "@angular/material/tabs";

import { Dimensions, ImageCroppedEvent, ImageTransform } from "ngx-image-cropper";
import {base64ToFile} from "./utils/blob.utils";
import {ShowImageCropperComponent} from "./show-image-cropper/show-image-cropper.component";
import {MatDialog} from "@angular/material/dialog";
import {WallpaperComponent} from "./wallpaper/wallpaper.component";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {Observable} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DatetimeService} from "./logic/datetime.service";
import {map, startWith} from "rxjs/operators";
import {LoadingIndicatorInterface, LoadingIndicatorService} from "../../services/loading-indicator.service";

export interface Timezones {
  city: string;
  timezone: string;
}

@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.component.html',
  styleUrls: ['./profile-setting.component.scss']
})
export class ProfileSettingComponent implements OnInit, AfterViewInit {

  tabs = [];
  form: FormGroup;
  activeTab: number = 0;
  rtlDirection: boolean;
  editable: boolean = false;
  private _subscription: Subscription = new Subscription();
  loadingIndicator: LoadingIndicatorInterface = {status: false, serviceName: 'changeLang'};

  /*timezone*/
  filteredOptions: Observable<any>;
  myControl = new FormControl();
  options;
  checkMoreClock: boolean;
  checkMoreClockContent: boolean;
  cityClocksList: Timezones[];
  /*timezone*/

  displayFn(timezone: Timezones): string {
    return timezone && timezone.city ? timezone.city : '';
  }

  private _filter(name: string): Timezones[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.city.toLowerCase().indexOf(filterValue) === 0);
  }

  constructor(private viewDirection: ViewDirectionService,
              private translate: TranslateService,
              public dialog: MatDialog,
              private _bottomSheet: MatBottomSheet,
              private _fb: FormBuilder,
              private loadingIndicatorService: LoadingIndicatorService,
              private datetimeService: DatetimeService) {
    this._subscription.add(
      this.loadingIndicatorService.currentLoadingStatus.subscribe(status => this.loadingIndicator = status)
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
      map(name => name ? this._filter(name) : this.options.slice())
    );


    console.log('this.filteredOptions', this.filteredOptions);
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

  createForm() {
    return new Promise((resolve) => {
      this.form = this._fb.group({
        name: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl(''),
        timezone: new FormControl('', Validators.required)
      });
      resolve(true);
    });
  }

  formPatchValue() {
    this.form.disable();
    this.editable = false;

    this.form.patchValue({
      name: 'ابوالفضل ابراهیمی',
      email: 'eden_a_e@yahoo.com',
      password: ''
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

  updateForm(event) {
    /*this.form = event;

    this.submit();*/
  }

  cancelBtn() {
    this.form.disable();

    this.formPatchValue();
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
}
