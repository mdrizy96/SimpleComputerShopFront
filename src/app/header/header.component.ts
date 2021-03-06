import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
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

}
