import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {LocalStorageService} from './local-storage.service';
import {CartLaptop, ICartLaptop} from '../models/shop.model';

@Injectable(
  {providedIn: 'root'}
)
export class CartService {
  isCartUpdated = false;

  cartUpdateChange: Subject<boolean> = new Subject<boolean>();

  constructor(private localStore: LocalStorageService) {
    this.cartUpdateChange.subscribe((value) => {
      this.isCartUpdated = value;
    });
  }

  toggleCartUpdate(): void {
    this.cartUpdateChange.next(!this.isCartUpdated);
  }

  getCartItems(): ICartLaptop[]{
    const storedCart = this.localStore.getItem('shop-cart-items');
    return JSON.parse(storedCart) as CartLaptop[];
  }

  clearCartItems(): void {
    this.localStore.store('shop-cart-items', []);
    this.toggleCartUpdate();
  }

  deleteItemFromCart(itemIndex: number): void {
    const storedCart = this.localStore.getItem('shop-cart-items');
    const laptops = JSON.parse(storedCart) as CartLaptop[];
    laptops.splice(itemIndex, 1);
    this.localStore.store('shop-cart-items', laptops);
    this.toggleCartUpdate();
  }
}
