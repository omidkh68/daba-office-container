import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ApiService} from '../users/logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from '../../services/message.service';
import {TranslateService} from '@ngx-translate/core';
import {ViewDirectionService} from '../../services/view-direction.service';
import {UserInfoService} from '../users/services/user-info.service';

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

  constructor(private fb: FormBuilder,
              private router: Router,
              private translate: TranslateService,
              private viewDirection: ViewDirectionService,
              private messageService: MessageService,
              private userInfoService: UserInfoService,
              private api: ApiService) {
    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: new FormControl(''),
      password: new FormControl(''),
      lang: new FormControl(this.rtlDirection ? 'fa' : 'en')
    });

    // todo: remove this line in production
    // setTimeout(() => this.login(), 500);
  }

  login() {
    this.form.disable();

    const formValue = this.form.value;

    delete(formValue.lang);

    this._subscription.add(
      this.api.login(formValue).subscribe((resp: any) => {
        const successfullMessage = this.getTranslate('login_info.login_successfully');

        this.messageService.showMessage(successfullMessage, 'success');

        this.userInfoService.changeLoginData(resp.data);

        this.router.navigateByUrl(`/`);
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
