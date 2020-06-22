import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ApiService} from '../users/logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from '../../services/message.service';
import {ViewDirectionService} from '../../services/view-direction.service';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

export interface LangInterface {
  id: string;
  name: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  rtlDirection: boolean;
  form: FormGroup;
  hide: boolean = true;
  languages: LangInterface[] = [
    {id: 'en', name: 'English'},
    {id: 'fa', name: 'پارسی'}
  ];

  private _subscription: Subscription = new Subscription();

  constructor(private _fb: FormBuilder,
              private _router: Router,
              private translate: TranslateService,
              private viewDirection: ViewDirectionService,
              private messageService: MessageService,
              private apiService: ApiService) {
    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      username: new FormControl('admin@admin.com'),
      password: new FormControl('1234567890'),
      lang: new FormControl(this.rtlDirection ? 'fa' : 'en')
    });
  }

  login() {
    this.form.disable();

    this._subscription.add(
      this.apiService.login(this.form.value).subscribe((resp: any) => {
        const successfullMessage = this.getTranslate('login_info.login_successfully');
        this.messageService.showMessage(successfullMessage, 'success');

        this._router.navigateByUrl(`/`);
      }, error => {
        this.form.enable();

        const failedMessage = this.getTranslate('login_info.login_failed');
        this.messageService.showMessage(failedMessage, 'error');
      })
    );
  }

  getTranslate(word) {
    return this.translate.instant(word);
  }

  changeLang(event) {
    this.viewDirection.changeDirection(event.value === 'fa');
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
