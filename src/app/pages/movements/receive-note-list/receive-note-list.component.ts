import { Component, OnInit } from '@angular/core';

import { StoresTrxesService, StoresService, SuppliersService, StoreKeepersService, BranchesService, EmployeesService } from 'src/app/shared/services';
import { StoreTrxe, FilterParams, Config } from 'src/app/shared/models';

const TRX_TYPE_ID = 4;

@Component({
  selector: 'app-receive-note-list',
  templateUrl: './receive-note-list.component.html',
  styleUrls: ['./receive-note-list.component.css']
})
export class ReceiveNoteListComponent implements OnInit {

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
      label: 'المستودع',
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
      key: 'tempReceiveNo',
      label: 'إشعار استلام مؤقت',
      visible: false
    },
    {
      key: 'recipientName',
      label: 'اسم المسلم',
      visible: false
    },
    {
      key: 'recordNo',
      label: 'رقم المستند',
      visible: true
    },
    {
      key: 'supplierName',
      label: 'المورد',
      visible: true
    },
    {
      key: 'attachments',
      label: 'المرفقات ',
      visible: false
    }, 
    {
      key: 'storeKeeperName',
      label: 'أمين المستودع',
      visible: false
    },
    {
      key: 'branchName',
      label: 'إدارة مستودعات',
      visible: false
    },
    {
      key: 'tempReceiveDate',
      label: 'تاريخ الاستلام',
      visible: false,
      date: true

    },
    {
      key: 'branchManagerName',
      label: 'مدير إدارة المستودعات  ',
      visible: false
    }, {
      key: 'purchaseOrderNo',
      label: 'رقم أمر الشراء ',
      visible: false
    },
    {
      key: 'shippingDocNo',
      label: 'وثيقة الشحن',
      visible: true
    },
    {
      key: 'shippingDate',
      label: 'تاريخ أمر الشراء ',
      visible: false,
      date: true
    },
    {
      key: 'shippingDate',
      label: 'تاريخ الشحن  ',
      visible: false,
      date: true

    },
    {
      key: 'checkDate',
      label: ' تاريخ  السند ',
      visible: false,
      date: true

    },
    {
      key: 'notes',
      label: ' ملاحظات  ',
      visible: false
    },
    {
      key: 'orderSerial',
      label: 'رقم محضر استلام  ',
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
