import {Component, Injector, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ApiService} from '../../users/logic/api.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from '../../message/service/message.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UserInfoService} from '../../users/services/user-info.service';
import {TranslateService} from '@ngx-translate/core';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {LoginResultInterface} from '../logic/login.interface';

export interface LangInterface {
  id: string;
  name: string;
}

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html'
})
export class LoginFormComponent implements OnInit {
  @Input()
  type: boolean;

  rtlDirection: boolean;
  form: FormGroup;
  hide: boolean = true;
  languages: LangInterface[] = [
    {id: 'en', name: 'English'},
    {id: 'fa', name: 'پارسی'}
  ];
  dialogData = null;
  dialogRef = null;

  private _subscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder,
              private api: ApiService,
              private router: Router,
              private translate: TranslateService,
              private messageService: MessageService,
              private userInfoService: UserInfoService,
              private viewDirection: ViewDirectionService,
              private injector: Injector) {
    this.dialogRef = this.injector.get(MatDialogRef, null);
    this.dialogData = this.injector.get(MAT_DIALOG_DATA, null);

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngOnInit(): void {
    this.createForm();

    setTimeout(() => this.login(), 200); // todo: remove this in production
  }

  createForm() {
    return new Promise((resolve) => {
      this.form = this.fb.group({
        // username: new FormControl(''),
        // password: new FormControl(''),
        username: new FormControl('khosrojerdi@dabacenter.ir'),
        password: new FormControl('123456'),
        lang: new FormControl(this.rtlDirection ? 'fa' : 'en')
      });

      this.viewDirection.changeDirection(this.form.get('lang').value === 'fa');

      resolve(true);
    });
  }

  login() {
    this.form.disable();

    const formValue = this.form.value;

    delete (formValue.lang);

    this._subscription.add(
      this.api.login(formValue).subscribe((resp: LoginResultInterface) => {
        if (resp.success) {
          const successfulMessage = this.getTranslate('login_info.login_successfully');

          this.messageService.showMessage(successfulMessage, 'success');

          this.userInfoService.changeLoginData(resp.data);

          if (this.dialogData) {
            this.dialogRef.close();
          } else {
            this.router.navigateByUrl(`/`);
          }
        } else {
          this.showErrorLogin();
        }
      }, () => {
        this.showErrorLogin();
      })
    );
  }

  showErrorLogin() {
    this.form.enable();

    const failedMessage = this.getTranslate('login_info.login_failed');

    this.messageService.showMessage(failedMessage, 'error');
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
