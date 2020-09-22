import { Component, OnInit, Input, EventEmitter, Output, ElementRef } from '@angular/core';
import Swal from 'sweetalert2'

import { AddEditTableColumn, Permission } from 'src/app/shared/models';
import { PermissionsService, ObjectsOperationsService } from 'src/app/shared/services';
import { FilterPipe, paginate } from '../../pipes';

interface FilterParams {
  queryString: string,
  sorting?: {
    column?: string,
    direction?: string
  },
  pagination?: {
    pageNumber?: number,
    pageSize?: number,
    totalPages?: number,
    totalItems?: number
  }
}

@Component({
  selector: 'app-code-name-table',
  templateUrl: './code-name-table.component.html',
  styleUrls: ['./code-name-table.component.css']
})
export class CodeNameTableComponent implements OnInit {
  //last row in the table that we create new recored by this is object
  newItem = {};

  filterParams: FilterParams = {
    pagination: {
      pageNumber: 1,
      pageSize: 10
    },
    queryString: "",
    sorting: {}
  };
  //cheak if user have permission to create , delete and update
  permission: Permission;
  //lable of first column
  @Input() codeLabel: string;
  //lable of socend column
  @Input() nameLabel: string;
  @Input() pattern: any = '';

  @Input() codeKey: string;
  @Input() nameKey: string;
  //get the permission from parent to assign it to  permission
  @Input() permissionId: number;
  @Input() busyPrinting: boolean;
  _extraColumn1: AddEditTableColumn;
  @Input()
  set extraColumn1(column: AddEditTableColumn) {
    this._extraColumn1 = column;
  }

  _busyCreating: boolean;
  @Input()
  set busyCreating(busy: boolean) {
    this._busyCreating = busy;
    if (!this._busyCreating) {
      this.newItem = {};
      this.getCurrentId();
    }
  }
  //reseve from the parent the data
  _itemsList: any[];
  //to crate packup if user click cancle on editing 
  _itemsListPackup: any[] = [];
  filteredList: any[];

  ngbPopover: string = '';

  //to call function after we set the list
  @Input()
  set itemsList(list: any) {
    this._itemsList = list || [];
    this.getCurrentId();
    this.filter();
  }

  @Output() getAllFun = new EventEmitter();
  //this to emit to parent the new recored
  @Output() createFun = new EventEmitter();
  @Output() updateFun = new EventEmitter();
  @Output() deleteFun = new EventEmitter();
  @Output() printFun = new EventEmitter();


  constructor(
    private permissionsService: PermissionsService,
    private objectsOperator: ObjectsOperationsService
  ) { }

  ngOnInit() {
    this.permission = this.permissionsService.getPermission(this.permissionId);
    this.getAll();
  }
  // parent call this method to reload data (by viewChield() )
  refresh() {
    this.getCurrentId();
    this.filter();
  }

  addToBackUp(item) {
    this.getFromBackUp(item);
    this._itemsListPackup.push(Object.assign({}, item));
  }
  getFromBackUp(item) {
    const packupItemIndex = this._itemsListPackup.findIndex(i => i[this.codeKey] == item[this.codeKey]);
    if (packupItemIndex < 0) return {};
    const packupItem = Object.assign({}, this._itemsListPackup[packupItemIndex]);
    this._itemsListPackup.splice(packupItemIndex, 1);
    return packupItem || {};
  }
  // Actions
  select(item) {
    if (!this.permission.update) return;
    if (item['selected']) return;
    this.addToBackUp(item);
    item['selected'] = true;
  }
  //emit event to parent to fire function that send data to _itemlist 
  getAll() {
    this.getAllFun.emit();
  }
  print() {
    this.printFun.emit();
  }

  //to emit event to parent(to create recored by emitted value)
  create() {
    this.createFun.emit(this.newItem);
    this.filterParams.pagination.pageNumber = this.filterParams.pagination.totalPages;

  }
  update(item) {
    item['busy'] = true;
    this.updateFun.emit(item);
  }

  //after click cancle we assign beckup to item 
  rollBack(item) {
    Object.assign(item, this.getFromBackUp(item));
    item['selected'] = false;
  }
  delete(item) {
    Swal({
      title: 'هل انت متأكد؟',
      text: `حذف العنصر "${item[this.nameKey]}"`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: "swal-confirm",
      cancelButtonClass: "swal-cancel",
      confirmButtonText: 'نعم, احذف!',
      cancelButtonText: 'إلغاء'
    }).then((result) => {
      if (result.value) {
        item['busy'] = true;
        this.deleteFun.emit(item[this.codeKey]);
      };
    })
  }

  //
  getCurrentId() {
    if (this._itemsList && this._itemsList.length > 0)
      this.newItem[this.codeKey] = Number(this._itemsList[this._itemsList.length - 1][this.codeKey]) + 1;
    else
      this.newItem[this.codeKey] = 1;
  }
  // Filters
  filter() {
    let filteredList = this._itemsList;
    // let filteredList = this.objectsOperator.copyArrayOfObjects(this._itemsList);
    filteredList = this.search(filteredList);
    filteredList = this.sort(filteredList);
    filteredList = this.paginate(filteredList);
    this.filteredList = filteredList;
  }
  //to search on value that and display the result
  search(list) {
    let searchResult = new FilterPipe().transform(list, this.filterParams.queryString, this.codeKey, this.nameKey);
    this.filterParams.pagination.totalItems = searchResult.length;
    this.filterParams.pagination.totalPages = Math.ceil(this.filterParams.pagination.totalItems / this.filterParams.pagination.pageSize);
    return searchResult;
  }
  sort(list): any[] {
    if (Object.keys(this.filterParams.sorting).length == 0) return list;
    var A = -1;//Asc
    var D = 1;//des
    if (this.filterParams.sorting.direction == "desc") {
      A *= -1;
      D *= -1;
    }
    return list.sort((item1, item2) => item1[this.filterParams.sorting.column] > item2[this.filterParams.sorting.column] ? A : D);
  }
  paginate(list): any[] {
    return new paginate().transform(list, this.filterParams.pagination.pageSize, this.filterParams.pagination.pageNumber);
  }
  // Helpers
  onSearch() {
    this.filterParams.pagination.pageNumber = 1;
    this.filter();
  }
  onSorted(e) {
    this.filterParams.sorting.column = e.sortColumn;
    this.filterParams.sorting.direction = e.sortDirection;
    this.filter();
  }
  changePage(pNo) {
    if (pNo < 0 || pNo == 0 || pNo == this.filterParams.pagination.pageNumber || pNo == this.filterParams.pagination.totalPages + 1)
      return;
    this.filterParams.pagination.pageNumber = pNo;
    this.filter();
  }

  isChangeExist(): boolean {
    for (let i = 0; i < this.filteredList.length; i++) {
      if (this.filteredList[i]['selected'])
        return true;
    }
    return false;
  }
  canDeactivate(): Promise<boolean> | boolean {
    if (!this.isChangeExist() && !this.newItem[this.nameKey]) return true;
    return new Promise((resolve, reject) => {
      Swal({
        title: 'المتابعة وتجاهل التغيرات؟',
        text: "لم يتم حفظ بعض التغيرات!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: "swal-confirm",
        cancelButtonClass: "swal-cancel",
        confirmButtonText: 'متابعة',
        cancelButtonText: 'رجوع'
      }).then(
        result => {
          resolve(result.value);
        }
      ).catch(
        err => {
          reject();
        }
      )
    });
  }

  preventNumberInput(event: any) {
    const inputChar = String.fromCharCode(event.charCode);
    if (!this.pattern.test(inputChar)) {    
        event.preventDefault();
    }
  }

  setPageSize(size) {
    this.filterParams.pagination.pageSize = size;
    this.filter();
  }

}
