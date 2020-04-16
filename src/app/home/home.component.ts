import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {trigger, transition, query, group, style, animate, animateChild} from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('animRoutes', [
      transition('* <=> *', [
        group([
          query(':enter',
            [
              style({
                position: 'absolute',
                width: '100%',
                transform: 'translateY(-100%)'
              }),
              animateChild()
            ],
            {optional: true}),

          // move page off screen right on leave
          query(':leave',
            [
              animate('500ms ease',
                style({
                  position: 'absolute',
                  width: '100%',
                  transform: 'translateY(100%)',
                  opacity: '0'
                })
              ),
              animateChild()
            ],
            {optional: true}),

          // move page in screen from left to right
          query(':enter',
            animate('500ms ease',
              style({
                opacity: 1,
                width: '100%',
                transform: 'translateY(0%)'
              })
            ),
            {optional: true})
        ])
      ])
    ])
  ],
})
export class HomeComponent implements OnInit {
  constructor() {
  }

  ngOnInit(): void {
  }

  getPage(outlet) {
    return outlet.activatedRouteData['page'] || 'one';
  }

  /*closeApp() {
    const window = remote.getCurrentWindow();

    const prompt = confirm('آیا موافق هستید؟');

    if (prompt) {
      window.close();
    }
  }*/

}
