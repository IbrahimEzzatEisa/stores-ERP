import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.css']
})
export class PageTitleComponent implements OnInit {

  _super: string;
  @Input()
  set super(text: string) {
    this._super = text;
  }

  _title: string;
  @Input()
  set title(text: string) {
    this._title = text;
  }

  constructor() { }

  ngOnInit() {
  }

}
