import { Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.component.html',
  styleUrls: ['./profile-setting.component.scss']
})
export class ProfileSettingComponent implements OnInit {





  tabs = [];
  activeTab: number = 0;
  rtlDirection: boolean;
  private _subscription: Subscription = new Subscription();

  constructor(private viewDirection: ViewDirectionService,
              private translate: TranslateService,
              public dialog: MatDialog,
              private _bottomSheet: MatBottomSheet) {
    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngOnInit(): void {
  }



  showWallpaperButtonSheet() {
    const dialogRef = this.dialog.open(WallpaperComponent, {
      // data: {action: 'addUser', source: this.contentModal},
      autoFocus: false,
      width: '600px',
      height: '500px'
    });

    this._subscription.add(
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          /*this.contentTable.push(result.body.data);
          this.dataSource = new MatTableDataSource<UserInterface>(this.contentTable);
          this.dataSource.paginator = this.paginator;*/
        }
      })
    );


    /*this._bottomSheet.open(WallpaperComponent, {
      panelClass: 'wallpaper-dialog-content'
    });*/
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
