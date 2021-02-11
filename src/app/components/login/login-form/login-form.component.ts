import {Component, Injector, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppConfig} from '../../../../environments/environment';
import {ApiService} from '../../users/logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from '../../message/service/message.service';
import {UserInfoService} from '../../users/services/user-info.service';
import {ElectronService} from '../../../core/services';
import {TranslateService} from '@ngx-translate/core';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {LoginInfoInterface, LoginInterface, LoginResultInterface} from '../logic/login.interface';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html'
})
export class LoginFormComponent implements OnInit {
  @Input()
  type: boolean;

  rtlDirection = false;
  form: FormGroup;
  hide = true;
  dialogData = null;
  dialogRef = null;

  private _subscription: Subscription = new Subscription();

  constructor(private router: Router,
              private fb: FormBuilder,
              private api: ApiService,
              private injector: Injector,
              private translate: TranslateService,
              private messageService: MessageService,
              private userInfoService: UserInfoService,
              private electronService: ElectronService,
              private viewDirection: ViewDirectionService) {
    this.dialogRef = this.injector.get(MatDialogRef, null);
    this.dialogData = this.injector.get(MAT_DIALOG_DATA, null);

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngOnInit(): void {
    this.createForm().finally();

    // setTimeout(() => this.login(), 200); // todo: remove this in production
  }

  createForm(): Promise<boolean> {
    return new Promise((resolve) => {
      this.form = this.fb.group({
        username: new FormControl(''),
        password: new FormControl(''),
        // username: new FormControl('khosrojerdi@dabacenter.ir'),
        // password: new FormControl('123456')
      });

      resolve(true);
    });
  }

  login(): void {
    this.form.disable();

    const formValue: LoginInfoInterface = this.form.value;

    this._subscription.add(
      this.api.login(formValue).subscribe((resp: LoginResultInterface) => {
        if (resp.success) {
          this.createFile(resp.data);

          this.userInfoService.changeLoginData(resp.data);

          if (this.dialogData) {
            this.dialogRef.close();
          } else {
            this.router.navigateByUrl(`/selectCompany`).finally();
            // this.router.navigateByUrl(`/`).finally();
          }
        } else {
          this.showErrorLogin();
        }
      }, () => {
        this.showErrorLogin();
      })
    );
  }

  createFile(data: LoginInterface): void {
    if (this.electronService.isElectron) {
      const homeDirectory = AppConfig.production ? this.electronService.remote.app.getPath('userData') : this.electronService.remote.app.getAppPath();

      const loginDataPath = this.electronService.path.join(homeDirectory, 'loginData.txt');

      this.electronService.fs.writeFileSync(loginDataPath, JSON.stringify(data));
    } else {
      localStorage.setItem('loginData', JSON.stringify(data));
    }
  }

  showErrorLogin(): void {
    this.form.enable();

    const failedMessage = this.getTranslate('login_info.login_failed');

    this.messageService.showMessage(failedMessage, 'error');
  }

  getTranslate(word: string): string {
    return this.translate.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
