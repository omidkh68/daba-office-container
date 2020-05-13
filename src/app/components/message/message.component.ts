import {Component, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  title: string;

  constructor(public snackbarRef: MatSnackBarRef<MessageComponent>,
              @Inject(MAT_SNACK_BAR_DATA) public data: string) {
    this.title = data;
  }

  ngOnInit(): void {
  }

}
