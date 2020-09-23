import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {TranslateService} from '@ngx-translate/core';

const DEFAULT_LANG = localStorage.getItem('defaultLang');

@Injectable({
  providedIn: 'root'
})
export class ViewDirectionService {
  body = document.querySelector('html');
  private _defaultDirection: boolean = DEFAULT_LANG !== null ? (DEFAULT_LANG === 'fa') : false;
  private _rtlDirection = new BehaviorSubject(this._defaultDirection);
  currentDirection = this._rtlDirection.asObservable();

  constructor(private translate: TranslateService) {
    this.body.classList.add(this._defaultDirection ? 'direction-fa' : 'direction-en');

    this.translate.addLangs(['en', 'fa']);
    this.translate.setDefaultLang(this._defaultDirection ? 'fa' : 'en');
    this.translate.use(this._defaultDirection ? 'fa' : 'en');

    this._rtlDirection.next(this._defaultDirection);

    localStorage.setItem('defaultLang', DEFAULT_LANG !== null ? DEFAULT_LANG : 'fa');
  }

  changeDirection(direction: boolean) {
    this._rtlDirection.next(direction);

    localStorage.setItem('defaultLang', direction === true ? 'fa' : 'en');

    if (direction) {
      this.body.classList.remove('direction-en');
      this.body.classList.add('direction-fa');

      this.translate.setDefaultLang('fa');
      this.translate.use('fa');
    } else {
      this.body.classList.remove('direction-fa');
      this.body.classList.add('direction-en');

      this.translate.setDefaultLang('en');
      this.translate.use('en');
    }
  }

  public getCurrentLang() {
    return this.translate.getDefaultLang();
  }
}
