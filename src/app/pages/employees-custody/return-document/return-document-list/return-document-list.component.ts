import { Component, OnInit } from '@angular/core';

import { StoresTrxesService } from 'src/app/shared/services';
import { StoreTrxe, FilterParams, Config } from 'src/app/shared/models';

const TRX_TYPE_ID = 8;
@Component({
  selector: 'app-return-document-list',
  templateUrl: './return-document-list.component.html',
  styleUrls: ['./return-document-list.component.css']
})
export class ReturnDocumentListComponent implements OnInit {
  storesTrexes: StoreTrxe[]
  filterParams = new FilterParams();
  totalNumberOfPages: number;
  totalNumberOfItems: number;
  busyLoading: boolean = false;

  configs: Config[] = [
    {
      key: 'trxSerial',
      label: 'المسلسل',
      visible: true
    },
    {
      key: 'docDescription',
      label: 'الرقم الخاص',
      visible: false
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
      key: 'ownerName',
      label: 'صاحب الصلاحية',
      visible: false
    },
    {
      key: 'branchName',
      label: 'الجهة المرجعة',
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
      key: 'deliveryPersonName',
      label: 'اسم الموظف ',
      visible: true
    },
    {
      key: 'reasonId',
      label: ' سبب الإرجاع',
      visible: true
    },
    {
      key: 'storeKeeperName',
      label: ' أمين المستودع',
      visible: false
    },
    {
      key: 'storeManagerId',
      label: 'مديرالمستودع  ',
      visible: false
    },
    {
      key: 'notes',
      label: ' ملاحظات  ',
      visible: false
    }
  ];

  constructor(
    private storesTrexService: StoresTrxesService
  ) { }

  ngOnInit() {
    this.filterParams.pageSize = 10;
    this.getAllStoresTrexes();
  }
  getAllStoresTrexes() {
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


