import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable(
  {providedIn: 'root'}
)
export class CartService {
  isCartUpdated = false;

  cartUpdateChange: Subject<boolean> = new Subject<boolean>();

  constructor() {
    this.cartUpdateChange.subscribe((value) => {
      this.isCartUpdated = value;
    });
  }

  toggleCartUpdate(): void {
    this.cartUpdateChange.next(!this.isCartUpdated);
  }
}
