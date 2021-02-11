import {MatDialog} from '@angular/material/dialog';
import {Injectable} from '@angular/core';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from '../../message/service/message.service';
import {UserInfoService} from '../../users/services/user-info.service';
import {TranslateService} from '@ngx-translate/core';
import {HttpErrorResponse} from '@angular/common/http';
import {LoginFormComponent} from '../login-form/login-form.component';
import {WindowManagerService} from '../../../services/window-manager.service';

@Injectable({
  providedIn: 'root'
})
export class RefreshLoginService {
  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private messageService: MessageService,
              private userInfoService: UserInfoService,
              private translateService: TranslateService,
              private windowManagerService: WindowManagerService) {
  }

  openLoginDialog(error: HttpErrorResponse): void {
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

      this._subscription.add(
        dialogRef.afterOpened().subscribe(() => {
          this.windowManagerService.dialogOnTop(dialogRef.id);
        })
      );

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

  getTranslate(word: string): string {
    return this.translateService.instant(word);
  }
}
