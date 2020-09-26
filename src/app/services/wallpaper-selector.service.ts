import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {UserInfoService} from '../components/users/services/user-info.service';

@Injectable({
  providedIn: 'root'
})
export class WallpaperSelectorService {
  currentWallpaper;

  protected preWallpaper;
  private _wallpaper;

  constructor(private userInfoService: UserInfoService) {
    this.preWallpaper = this.userInfoService.getUserInfo.background_image !== null ? 'url(' + this.userInfoService.getUserInfo.background_image + ')' : 'url(./assets/images/wallpapers/18.jpg)';
    this._wallpaper = new BehaviorSubject(this.preWallpaper);
    this.currentWallpaper = this._wallpaper.asObservable();
  }

  changeWallpaper(newWallpaper) {
    this._wallpaper.next(newWallpaper);
  }
}




