import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs/internal/Subscription';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {MessageService} from '../../../services/message.service';
import {UserInfoService} from '../../users/services/user-info.service';
import {TranslateService} from '@ngx-translate/core';
import {LoginFormComponent} from '../login-form/login-form.component';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RefreshLoginService {

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private userInfoService: UserInfoService,
              private translateService: TranslateService,
              private messageService: MessageService) {
  }

  openLoginDialog(error: HttpErrorResponse) {
    if (error.status === 401) {
      const dialogRef = this.dialog.open(LoginFormComponent, {
        autoFocus: false,
        closeOnNavigation: false,
        disableClose: true,
        width: '400px',
        height: '310px',
        panelClass: 'refresh-login-dialog',
        data: {action: 'refresh-login'}
      });

      const message = this.getTranslate('login_info.refresh_login');

      this.messageService.showMessage(message, 'error');

      this._subscription.add(
        dialogRef.afterClosed().subscribe((resp: any) => {
          if (resp) {
            // this.messageService.showMessage(`${resp.message}`);
          }
        })
      );
    }
  }

  getTranslate(word) {
    return this.translateService.instant(word);
  }
}
