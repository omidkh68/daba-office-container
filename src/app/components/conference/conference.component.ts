import {AfterViewInit, Component, ViewChild, ViewContainerRef} from '@angular/core';
import {LazyComponentService} from '../../services/lazy-component.service';
import {NbWindowRef} from '@nebular/theme';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.scss']
})
export class ConferenceComponent implements AfterViewInit {
  @ViewChild('container', {read: ViewContainerRef}) container;

  constructor(private lazyComponentService: LazyComponentService,
              private windowRef: NbWindowRef) {
  }

  ngOnInit() {
  }

  async ngAfterViewInit() {
    this.lazyComponentService.loadComponent('conferenceModuleId', this.container);
  }

  ngOnDestroy(): void {
    console.log('des conf');
  }
}
