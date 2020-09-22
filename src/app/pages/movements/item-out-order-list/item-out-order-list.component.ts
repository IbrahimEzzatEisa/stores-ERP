import { Component, OnInit } from '@angular/core';

import { StoresTrxesService } from 'src/app/shared/services';
import { StoreTrxe, FilterParams, Config } from 'src/app/shared/models';

const TRX_TYPE_ID = 106;

@Component({
  selector: 'app-item-out-order-list',
  templateUrl: './item-out-order-list.component.html',
  styleUrls: ['./item-out-order-list.component.css']
})
export class ItemOutOrderListComponent implements OnInit {
  storesTrexes:StoreTrxe[]
  filterParams = new FilterParams();
  totalNumberOfPages: number;
  totalNumberOfItems: number;
  busyLoading: boolean = false;

  configs:Config[]=[
    {
      key: 'trxSerial',
      label: 'الرقم الخاص',
      visible: true
    },
    {
      key: 'storeName',
      label: ' المستودع',
      visible: true
    },
    {
      key: 'date',
      label: 'التاريخ',
      visible: true,
      date: true
    },
    {
      key: 'pagesCount',
      label: 'عدد الصفحات',
      visible: false
    },
    {
      key: 'deliveryPersonName',
      label: 'اسم المستلم',
      visible: false
    },
    {
      key: 'ownerName',
      label: 'صاحب الصلاحية',
      visible: false
    },
    {
      key: 'demandBranchName',
      label: 'الجهة الطالبة',
      visible: false
    },
    {
      key: 'branchManagerName',
      label: 'رئيس الجهة',
      visible: false
    },
    {
      key: 'recordNo',
      label: ' رقم المستند',
      visible: true
    },
    {
      key: 'storeKeeperName',
      label: ' أمين المستودع',
      visible: false
    },
    {
      key: 'branchName',
      label: ' إدارة مستودعات',
      visible: false
    },
    {
      key: 'branchManagerName',
      label: 'مدير إدارة المستودعات  ',
      visible: false
    },
    {
      key: 'notes',
      label: ' ملاحظات  ',
      visible: false
    }
  ];

  constructor(
    private storesTrexService:StoresTrxesService
  ) { }

  ngOnInit() {
    this.filterParams.pageSize = 10;
    this.getAllStoresTrexes();
  }
  getAllStoresTrexes(){
    this.busyLoading = true;
    this.storesTrexService.getAll(TRX_TYPE_ID, this.filterParams).subscribe(
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

