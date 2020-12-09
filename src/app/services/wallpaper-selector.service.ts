import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {UserInfoService} from '../components/users/services/user-info.service';

@Injectable({
  providedIn: 'root'
})
export class WallpaperSelectorService {
  private _wallpaper: string = this.userInfoService.getUserInfo && this.userInfoService.getUserInfo.background_image ? this.userInfoService.getUserInfo.background_image : './assets/images/wallpapers/7.jpg';
  private wallpaper = new BehaviorSubject(this._wallpaper);
  public currentWallpaper = this.wallpaper.asObservable();

  constructor(private userInfoService: UserInfoService) {
  }

  changeWallpaper(newWallpaper) {
    if (newWallpaper !== '') {
      this.wallpaper.next(newWallpaper);
    }
  }
}




