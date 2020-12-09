import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {AddressInterface} from '../logic/address.interface';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private _address: AddressInterface | null = null;
  private address = new BehaviorSubject(this._address);
  public currentAddress = this.address.asObservable();

  changeAddress(address: AddressInterface) {
    this.address.next(address);

    setTimeout(() => this.address.next(null), 5000);
  }
}
