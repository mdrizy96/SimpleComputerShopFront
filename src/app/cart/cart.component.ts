import { Component, OnInit } from '@angular/core';
import {CartService} from '../core/services/cart.service';
import {ICartLaptop} from '../core/models/shop.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styles: [
  ]
})
export class CartComponent implements OnInit {
  cartList!: ICartLaptop[];

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartList = this.cartService.getCartItems();
  }

  clearCart(): void{
    this.cartList = [];
    this.cartService.clearCartItems();
  }

  removeItemFromCart(index: number): void {
    this.cartList.splice(index, 1);
    this.cartService.deleteItemFromCart(index);
  }
}
