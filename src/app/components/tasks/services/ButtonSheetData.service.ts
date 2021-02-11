import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {TaskBottomSheetInterface} from '../task-bottom-sheet/logic/TaskBottomSheet.interface';

@Injectable({
  providedIn: 'root'
})
export class ButtonSheetDataService {
  private _defaultButtonSheetData: TaskBottomSheetInterface | null = null;
  private buttonSheetData = new BehaviorSubject(this._defaultButtonSheetData);
  public currentButtonSheetData = this.buttonSheetData.asObservable();

  constructor() {
  }

  changeButtonSheetData(buttonSheetData: TaskBottomSheetInterface | null): void {
    this.buttonSheetData.next(buttonSheetData);

    setTimeout(() => {
      this.buttonSheetData.next(null);
    }, 200);
  }
}
