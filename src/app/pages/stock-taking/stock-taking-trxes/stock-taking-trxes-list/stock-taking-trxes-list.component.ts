import { Component, OnInit } from '@angular/core';
import {  FilterParams, Config, StockTakingTrxe } from 'src/app/shared/models';
import { StockTakingTrxesService } from 'src/app/shared/services';



@Component({
  selector: 'app-stock-taking-trxes-list',
  templateUrl: './stock-taking-trxes-list.component.html'
})
export class StockTakingTrxesListComponent implements OnInit {
  
  stockTakingTrxs: StockTakingTrxe[];
  busyLoading: boolean = false;
  filterParams = new FilterParams();
  totalNumberOfPages: number;
  totalNumberOfItems: number;
  configs:Config[]=[
    {
      key: 'serial',
      label: 'الرقم الخاص',
      visible: true
    },
    {
      key: 'storeName',
      label: ' المستودع ',
      visible: true
    },
    {
      key: 'stockTakingTypeName',
      label: 'الجرد',
      visible: true
    },
    {
      key: 'itemGroupName',
      label: 'مجموعة الأصناف',
      visible: true
    },
    {
      key: 'storeKeeperName',
      label: 'مأمور المستودع ',
      visible: true
    },
    {
      key: 'storeManagerName',
      label: 'مدير المستودع ',
      visible: false
    },
    {
      key: 'date',
      label: 'تاريخ بداية الجرد',
      visible: false
    },
    {
      key: 'endDate',
      label: 'تاريخ نهاية الجرد',
      visible: false
    },
    {
      key: 'pagesCount',
      label: 'عدد الصفحات',
      visible: false
    },
     {
      key: 'attachments',
      label: 'المرفقات',
      visible: false
    },
    {
      key: 'notes',
      label: 'الملاحظات',
      visible: false
    }


  ];
  constructor(
    private stockTakingService:StockTakingTrxesService,
  ) { }

  ngOnInit() {
    this.filterParams.pageSize = 10;
    this.listAllStockTaking();
  }

  listAllStockTaking(){
    this.busyLoading =true;
    this.stockTakingService.getAll(this.filterParams).subscribe(
      res => {
        this.stockTakingTrxs = res.result;
        this.filterParams.pageNumber = res.pagination.currentPage;
        this.filterParams.pageSize = res.pagination.itemsPerPage;
        this.totalNumberOfPages = res.pagination.totalPages;
        this.totalNumberOfItems = res.pagination.totalItems;
        this.busyLoading = false;
      },
      err => {
        this.busyLoading = false;
      }

    );
  }

  
  changePageSize(pageSize) {
    this.filterParams.pageNumber = 1;
    this.filterParams.pageSize = pageSize;
    this.listAllStockTaking();
  }
  search(queryString) {
    this.filterParams.pageNumber = 1;
    this.filterParams.searchValue = queryString;
    this.listAllStockTaking();
  }
  
  sort(sortParams) {
    this.filterParams.pageNumber = 1;
    this.filterParams.sortField = sortParams.sortColumn;
    this.filterParams.sortDirection = sortParams.sortDirection;
    this.listAllStockTaking();
  }
  changePage(pageNumber) {
    this.filterParams.pageNumber = pageNumber;
    this.listAllStockTaking();
  }

}

