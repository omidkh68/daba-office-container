import {AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild} from '@angular/core';
import {UserInterface} from '../../../users/logic/user-interface';

@Component({
  selector: 'app-time-area',
  templateUrl: './time-area.component.html',
  styleUrls: ['./time-area.component.scss']
})
export class TimeAreaComponent implements AfterViewInit {
  @Input()
  loggedInUser: UserInterface;

  @Input()
  rtlDirection: boolean;

  graduations: Array<number> = new Array(60);

  @ViewChild('hourHand') hourHand: ElementRef;
  @ViewChild('minuteHand') minuteHand: ElementRef;
  @ViewChild('secondHand') secondHand: ElementRef;

  constructor(private render: Renderer2) {
  }

  ngAfterViewInit(): void {
    this.timer();

    setInterval(() => this.timer(), 1000);
  }

  timer() {
    this.sethandRotation('hour');
    this.sethandRotation('minute');
    this.sethandRotation('second');
  }

  /**
   * Changes the rotation of the hands of the clock
   * @param  {HTMLElement} hand   One of the hand of the clock
   */
  sethandRotation(hand) {
    let date = new Date(), hours, minutes, seconds, percentage, degree;

    switch (hand) {
      case 'hour':
        hours = date.getHours();
        hand = this.hourHand.nativeElement;
        percentage = this.numberToPercentage(hours, 12);
        break;
      case 'minute':
        minutes = date.getMinutes();
        hand = this.minuteHand.nativeElement;
        percentage = this.numberToPercentage(minutes, 60);
        break;
      case 'second':
        seconds = date.getSeconds();
        hand = this.secondHand.nativeElement;
        percentage = this.numberToPercentage(seconds, 60);
        break;
    }

    degree = this.percentageToDegree(percentage);

    this.render.setStyle(hand, 'transform', `rotate(${degree}deg) translate(-50%, -50%)`);
  }

  /**
   * Converting a number to a percentage
   * @param  {number} number Number
   * @param  {number} max    Maximum value of the number
   * @return {number}        Return a percentage
   */
  numberToPercentage(number = 0, max = 60) {
    return (number / max) * 100;
  }

  /**
   * Converting a percentage to a degree
   * @param  {number} percentage Percentage
   * @return {number}            Return a degree
   */
  percentageToDegree(percentage = 0) {
    return (percentage * 360) / 100;
  }
}
