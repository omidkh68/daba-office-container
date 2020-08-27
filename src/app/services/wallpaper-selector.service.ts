import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';

const DEFAULT_WALLPAPER = localStorage.getItem('defaultAdminWallpaper');

@Injectable({
  providedIn: 'root'
})
export class WallpaperSelectorService {
  currentWallpaper;

  protected preWallpaper;
  private _defaultFromLocalStorage: string;
  private _wallpaper;

  constructor() {
    this.preWallpaper = 'url(./assets/bg/bg-18.jpg)';
    this._defaultFromLocalStorage = DEFAULT_WALLPAPER !== null ? DEFAULT_WALLPAPER : this.preWallpaper;
    this._wallpaper = new BehaviorSubject(this._defaultFromLocalStorage);
    this.currentWallpaper = this._wallpaper.asObservable();

    localStorage.setItem('defaultAdminWallpaper', this.preWallpaper);
  }

  changeWallpaper(newWallpaper) {
    this._wallpaper.next(newWallpaper);
    localStorage.setItem('defaultAdminWallpaper', newWallpaper);
  }
}




