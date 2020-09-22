import { Component, OnInit } from '@angular/core';

import { StoresTrxesService } from 'src/app/shared/services';
import { StoreTrxeWithNames, FilterParams, Config } from 'src/app/shared/models';
const trxTypeId = 0;

@Component({
  selector: 'app-opening-balance-list',
  templateUrl: './opening-balance-list.component.html'
})
export class OpeningBalanceListComponent implements OnInit {
  storesTrexes:StoreTrxeWithNames[]
  filterParams = new FilterParams();
  totalNumberOfPages: number;
  totalNumberOfItems: number;
  busyLoading: boolean = false;

  configs:Config[]=[
    {
      key: 'trxSerial',
      label: ' كود الارصدة',
      visible: true
    },
    {
      key: 'storeName',
      label: 'المستودع',
      visible: true
    },
    {
      key: 'date',
      label: 'التاريخ',
      visible: true,
      date: true
    }
  ];

  constructor(
    private storesTrexService: StoresTrxesService
  ) { }

  ngOnInit() {
    this.filterParams.pageSize = 10;
    this.getAllStoresTrexes();
  }
  getAllStoresTrexes(){
    this.busyLoading = true;
    this.storesTrexService.getAll(trxTypeId, this.filterParams).subscribe(
      res => {
        this.storesTrexes = res.result;
        this.filterParams.pageNumber = res.pagination.currentPage;
        this.filterParams.pageSize = res.pagination.itemsPerPage;
        this.totalNumberOfPages = res.pagination.totalPages;
        this.totalNumberOfItems = res.pagination.totalItems;
        this.busyLoading = false;
      },
      err => {
        this.busyLoading = false;
      }
    )

  }
  changePageSize(pageSize) {
    this.filterParams.pageNumber = 1;
    this.filterParams.pageSize = pageSize;
    this.getAllStoresTrexes();
  }
  search(queryString) {
    this.filterParams.pageNumber = 1;
    this.filterParams.searchValue = queryString;
    this.getAllStoresTrexes();
  }
  sort(sortParams) {
    this.filterParams.pageNumber = 1;
    this.filterParams.sortField = sortParams.sortColumn;
    this.filterParams.sortDirection = sortParams.sortDirection;
    this.getAllStoresTrexes();
  }
  changePage(pageNumber) {
    this.filterParams.pageNumber = pageNumber;
    this.getAllStoresTrexes();
  }

}
