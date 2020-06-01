import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/internal/Subscription';
import {BottomSheetInterface} from '../../../bottom-sheet/logic/bottomSheet.interface';
import {ViewDirectionService} from '../../../../services/view-direction.service';

@Component({
  selector: 'app-soft-phone-contact-detail',
  templateUrl: './soft-phone-contact-detail.component.html',
  styleUrls: ['./soft-phone-contact-detail.component.scss']
})
export class SoftPhoneContactDetailComponent implements OnInit, OnDestroy {
  rtlDirection;
  bottomSheetData: BottomSheetInterface;
  form: FormGroup;
  data;

  private _subscription: Subscription = new Subscription();

  constructor(private viewDirection: ViewDirectionService,
              private fb: FormBuilder) {
    this._subscription.add(
      this.viewDirection.currentDirection.subscribe(direction => this.rtlDirection = direction)
    );
  }

  ngOnInit(): void {
    this.data = this.bottomSheetData.data;

    if (this.data) {
      this.createForm().then(() => {
        this.form.patchValue({
          name: this.data.name,
          family: this.data.family,
          extension: this.data.extension
        });
      });
    } else {
      this.createForm();
    }
  }

  createForm() {
    return new Promise((resolve) => {
        this.form = this.fb.group({
          name: new FormControl('', Validators.required),
          family: new FormControl('', Validators.required),
          extension: new FormControl(0, Validators.required)
        });

        resolve();
    });
  }

  closeBottomSheet() {
    this.bottomSheetData.bottomSheetRef.close();
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
