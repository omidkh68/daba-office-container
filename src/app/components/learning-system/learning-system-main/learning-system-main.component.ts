import {AfterViewInit, Component, Injector, OnDestroy} from '@angular/core';
import {timer} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../logic/api.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {MessageService} from '../../message/service/message.service';
import {LoginDataClass} from '../../../services/loginData.class';
import {WebViewService} from '../service/web-view.service';
import {UserInfoService} from '../../users/services/user-info.service';
import {ElectronService} from '../../../core/services';
import {TranslateService} from '@ngx-translate/core';
import {ApproveComponent} from '../../approve/approve.component';
import {ViewDirectionService} from '../../../services/view-direction.service';
import {WindowManagerService} from '../../../services/window-manager.service';
import {LearningSystemPasswordComponent} from '../learning-system-password/learning-system-password.component';
import {LmsResultInterface, RoomInterface} from '../logic/lms.interface';
import {LearningSystemCreateRoomComponent} from '../learning-system-create-room/learning-system-create-room.component';
import {LoadingIndicatorInterface, LoadingIndicatorService} from '../../../services/loading-indicator.service';

@Component({
  selector: 'app-learning-system-main',
  templateUrl: './learning-system-main.component.html',
  styleUrls: ['./learning-system-main.component.scss']
})
export class LearningSystemMainComponent extends LoginDataClass implements AfterViewInit, OnDestroy {
  rooms: Array<RoomInterface> = null;
  rtlDirection = false;
  loadingIndicator: LoadingIndicatorInterface = null;
  showFrame = false;
  frameUrl: string;
  timerDueTime = 5000;
  timerPeriod = 20000;
  globalTimer = null;
  globalTimerSubscription: Subscription;

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog,
              private injector: Injector,
              private apiService: ApiService,
              private messageService: MessageService,
              private webViewService: WebViewService,
              private userInfoService: UserInfoService,
              private electronService: ElectronService,
              private translateService: TranslateService,
              private viewDirection: ViewDirectionService,
              private windowManagerService: WindowManagerService,
              private loadingIndicatorService: LoadingIndicatorService) {
    super(injector, userInfoService);

    this._subscription.add(
      this.loadingIndicatorService.currentLoadingStatus.subscribe(status => this.loadingIndicator = status)
    );

    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngAfterViewInit(): void {
    this.globalTimer = timer(
      this.timerDueTime, this.timerPeriod
    );

    this.globalTimerSubscription = this.globalTimer.subscribe(() => this.getRooms());
  }

  getRooms(): void {
    this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'learningSystem'});

    this._subscription.add(
      this.apiService.getRooms().subscribe((resp: LmsResultInterface) => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'learningSystem'});

        if (resp.result === 'SUCCESSFUL') {
          this.rooms = resp.contents;
        }
      }, () => {
        this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'learningSystem'});
      })
    );
  }

  createNewRoom(): void {
    const dialogRef = this.dialog.open(LearningSystemCreateRoomComponent, {
      autoFocus: false,
      width: '500px',
      height: '400px'
    });

    this._subscription.add(
      dialogRef.afterOpened().subscribe(() => {
        this.windowManagerService.dialogOnTop(dialogRef.id);
      })
    );

    this._subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getRooms();
        }
      })
    );
  }

  joinRoom(room: RoomInterface): void {
    const dialogRef = this.dialog.open(LearningSystemPasswordComponent, {
      autoFocus: false,
      width: '420px',
      height: '220px',
      data: room
    });

    this._subscription.add(
      dialogRef.afterOpened().subscribe(() => {
        this.windowManagerService.dialogOnTop(dialogRef.id);
      })
    );

    this._subscription.add(
      dialogRef.afterClosed().subscribe(url => {
        if (url) {
          this.getRooms();

          if (this.electronService.isElectron) {
            this.frameUrl = url;

            this.showFrame = true;
          } else {
            window.open(url, '_blank');
          }
        }
      })
    );
  }

  exitRoom(): void {
    const dialogRef = this.dialog.open(ApproveComponent, {
      data: {
        title: this.getTranslate('learning.exit_room'),
        message: this.getTranslate('learning.confirm_exit_room')
      },
      autoFocus: false,
      width: '70vh',
      maxWidth: '350px',
      panelClass: 'approve-detail-dialog',
      height: '160px'
    });

    this._subscription.add(
      dialogRef.afterOpened().subscribe(() => {
        this.windowManagerService.dialogOnTop(dialogRef.id);
      })
    );

    this._subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.showFrame = !this.showFrame;

          this.webViewService.changeRefreshWebView({visible: false, doRefresh: false});

          this.getRooms();
        }
      })
    );
  }

  deleteRoom(roomId: number): void {
    const dialogRef = this.dialog.open(ApproveComponent, {
      data: {
        title: this.getTranslate('learning.delete_room'),
        message: this.getTranslate('learning.confirm_delete_room')
      },
      autoFocus: false,
      width: '70vh',
      maxWidth: '350px',
      panelClass: 'approve-detail-dialog',
      height: '160px'
    });

    this._subscription.add(
      dialogRef.afterOpened().subscribe(() => {
        this.windowManagerService.dialogOnTop(dialogRef.id);
      })
    );

    this._subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'learningSystem'});

          this._subscription.add(
            this.apiService.deleteRoom(roomId).subscribe((resp: LmsResultInterface) => {
              this.loadingIndicatorService.changeLoadingStatus({status: false, serviceName: 'learningSystem'});

              if (resp.result === 'SUCCESSFUL') {
                this.messageService.showMessage(this.getTranslate('learning.delete_room_success'), 'success');
              } else if (resp.result === 'FAIL') {
                this.messageService.showMessage(this.getTranslate('learning.delete_room_error'), 'error');
              }

              this.getRooms();
            }, () => {
              this.loadingIndicatorService.changeLoadingStatus({status: true, serviceName: 'learningSystem'});

              this.messageService.showMessage(this.getTranslate('learning.delete_room_error'), 'error');
            })
          );
        }
      })
    );
  }

  getTranslate(word: string): string {
    return this.translateService.instant(word);
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }

    if (this.globalTimerSubscription) {
      this.globalTimerSubscription.unsubscribe();
      this.globalTimer = null;
    }

    this.webViewService.changeRefreshWebView({visible: false, doRefresh: false});
  }
}
