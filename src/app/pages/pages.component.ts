import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pages',
  template: `
    <div class="no-skin rtl">
      <app-main-header></app-main-header>
      <app-main-top-nav></app-main-top-nav>
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
