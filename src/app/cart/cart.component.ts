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
  totalCostOfItemsInCart = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartList = this.cartService.getCartItems();
    this.calculateTotalCostOfItemsInCart();
  }

  clearCart(): void{
    this.cartList = [];
    this.cartService.clearCartItems();
    this.calculateTotalCostOfItemsInCart();
  }

  removeItemFromCart(index: number): void {
    this.cartList.splice(index, 1);
    this.cartService.deleteItemFromCart(index);
    this.calculateTotalCostOfItemsInCart();
  }

  calculateTotalCostOfItemsInCart(): void{
    this.totalCostOfItemsInCart =  this.cartList.reduce((acc, val) => acc + val.totalCost, 0 );
  }
}
