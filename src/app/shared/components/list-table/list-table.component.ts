import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TableConfig } from 'src/app/shared/models';

@Component({
  selector: 'app-list-table',
  templateUrl: './list-table.component.html',
  styleUrls: ['./list-table.component.css']
})
export class ListTableComponent implements OnInit {

  queryString: string;
  _itemsList: any[];
  @Input()
  set itemsList(list) {
    this._itemsList = list || [];
  }

  _configs: TableConfig[];
  @Input()
  set configs(conf) {
    this._configs = conf || [];
  }

  _loading: boolean;
  @Input()
  set loading(isLoading) {
    this._loading = isLoading || false;
  }

  @Input() routeParamsKeys: string[];

  @Input() addButtonText: string;
  @Input() addEditRoute: string;
  @Input() hide: boolean;
  @Input() busyPrinting: boolean;


  _pageSize: number;
  @Input()
  set pageSize(pageSize) {
    this._pageSize = pageSize;
  }
  @Output() OnPageSizeChange = new EventEmitter<number>();
  @Output() onSearch = new EventEmitter<string>();
  @Output() onSort = new EventEmitter<{sortColumn: string, sortDirection:string}>();

  @Output() print? = new EventEmitter();

  searchTimeout: any;

  headersSelectorShown: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.routeParamsKeys = this.routeParamsKeys || [this._configs[0].key];
    this.addEditRoute = this.addEditRoute || '../';
  }


  redirectToAdd() {
    this.router.navigate([this.addEditRoute], {relativeTo: this.activatedRoute});
  }
  redirectToUpdate(modal: any) {
    let routeParams = '';
    for(let i = 0; i < this.routeParamsKeys.length; i++) {
      routeParams+=`/${modal[this.routeParamsKeys[i]]}`;
    }
    this.router.navigate([this.addEditRoute+routeParams], {relativeTo: this.activatedRoute});
  }
  setPageSize(number) {
    this.OnPageSizeChange.emit(number)
  }
  search(value) {
    if(this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout((()=> {
      this.onSearch.emit(value);
    }).bind(this), 800)
  }
  sort(sortingParams) {
    this.onSort.emit(sortingParams);
  }
  removeSearch() {
    this.queryString = "";
    if(this.searchTimeout) clearTimeout(this.searchTimeout);
    this.onSearch.emit("");
  }

  printList(){
    this.print.emit();
  }

}
