import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  _page: number;
  @Input()
  set page(page: number) {
    this._page = page || 1;
  }

  _size: number;
  @Input()
  set size(numberOfPages) {
    this._size = numberOfPages;
  }

  @Output() onChange = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  changePage(page) {
    if( page<1 || page>this._size) return;
    this.onChange.emit(page);
  }

}
