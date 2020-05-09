import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-conference-main',
  templateUrl: './conference-main.component.html',
  styleUrls: ['./conference-main.component.scss']
})
export class ConferenceMainComponent implements AfterViewInit {
  @ViewChild('webFrame', {static: false}) webFrame: ElementRef;

  constructor() { }

  ngAfterViewInit(): void {
    this.webFrame.nativeElement.setAttribute('src', 'https://conference.dabacenter.ir/main.php?username=omid&confname=daba');

    this.webFrame.nativeElement.addEventListener('did-start-loading', () => {
      console.log('did-start-loading');
    });

    this.webFrame.nativeElement.addEventListener('did-stop-loading', () => {
      console.log('did-stop-loading');
    });
  }

}
