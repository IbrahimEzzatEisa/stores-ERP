import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-table-info',
  templateUrl: './table-info.component.html',
  styleUrls: ['./table-info.component.css']
})
export class TableInfoComponent implements OnChanges {

  _page: number;
  @Input()
  set page(page) {
    this._page = page;
  }

  _pageSize: number;
  @Input()
  set pageSize(pageSize) {
    this._pageSize = pageSize;
  }

  _length: number;
  @Input()
  set length(length) {
    this._length = length;
  }

  _total: number;
  @Input()
  set total(total) {
    this._total = total;
  }

  from: number;
  to: number;

  ngOnChanges() {
    if(! this._page || !this._pageSize || !this._length) return;
    this.from = ( this._page - 1 )  * this._pageSize + 1;
    this.to = this.from + this._length -1;
  }


}
