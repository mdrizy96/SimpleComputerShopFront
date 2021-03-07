import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {LocalStorageService} from '../core/services/local-storage.service';
import {CartLaptop, ICartLaptop} from '../core/models/shop.model';
import {CartService} from '../core/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  itemsInCart = 0;
  cartUpdated = false;

  constructor(private localStore: LocalStorageService, private cartService: CartService) {
    // this.cartUpdated = cartService.isCartUpdated;
  }

  ngOnInit(): void {
    const storedCart = this.localStore.getItem('shop-cart-items');
    if (!storedCart){
      this.localStore.store('shop-cart-items', []);
    }
    else {
      this.itemsInCart = JSON.parse(storedCart).length;
    }

    this.cartService.cartUpdateChange.subscribe(value => {
      if (value){
        this.itemsInCart = this.updateCartCount();
        this.cartService.toggleCartUpdate();
      }
    });
  }

  updateCartCount(): number{
    const storedCart = this.localStore.getItem('shop-cart-items');
    return JSON.parse(storedCart).length;
  }

  navigateToTop(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  scrollToId(idName: string): void {
    const el = document.querySelector('' + idName) as HTMLElement;
    el.scrollIntoView({ behavior: 'smooth' });
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
  }

}
