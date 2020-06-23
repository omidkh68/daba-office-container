import {Component, ElementRef, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs/internal/Subscription';
import {ConferenceInterface} from '../logic/conference.interface';
import {ConferenceAddComponent} from '../conference-add/conference-add.component';

@Component({
  selector: 'app-conference-main',
  templateUrl: './conference-main.component.html',
  styleUrls: ['./conference-main.component.scss']
})
export class ConferenceMainComponent {
  @ViewChild('webFrame', {static: false}) webFrame: ElementRef;
  showConference: boolean = false;

  private _subscription: Subscription = new Subscription();

  constructor(public dialog: MatDialog) { }

  addNewVideoConf() {
    const dialogRef = this.dialog.open(ConferenceAddComponent, {
      autoFocus: false,
      width: '300px',
      height: '210px',
      panelClass: 'status-dialog'
    });

    this._subscription.add(
      dialogRef.afterClosed().subscribe((resp: ConferenceInterface) => {
        if (resp) {
          this.webFrame.nativeElement.setAttribute('src', `https://conference.dabacenter.ir/main.php?username=${resp.username}&confname=${resp.confname}`);

          this.webFrame.nativeElement.addEventListener('did-start-loading', () => {
            console.log('did-start-loading');
          });

          this.webFrame.nativeElement.addEventListener('did-stop-loading', () => {
            console.log('did-stop-loading');
          });

          setTimeout(() => {
            this.showConference = true;
          });
        }
      })
    );
  }
}
