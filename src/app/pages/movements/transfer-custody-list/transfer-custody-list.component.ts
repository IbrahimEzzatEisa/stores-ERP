import { Component, OnInit } from '@angular/core';
import { Config, FilterParams, StoreTrxeWithNames } from 'src/app/shared/models';
import { TrxTypeIds } from 'src/app/shared/enums';
import { StoresTrxesService } from 'src/app/shared/services';

const TRX_TYPE_ID = TrxTypeIds.transferCustody;

@Component({
  selector: 'app-transfer-custody-list',
  templateUrl: './transfer-custody-list.component.html',
  styleUrls: ['./transfer-custody-list.component.css']
})
export class TransferCustodyListComponent implements OnInit {

  storesTrexes: StoreTrxeWithNames[]
  filterParams = new FilterParams();
  totalNumberOfPages: number;
  totalNumberOfItems: number;
  busyLoading: boolean = false;

  configs:Config[]=[
    {
      key: 'trxSerial',
      label: 'المسلسل',
      visible: true
    },
    {
      key: 'date',
      label: 'التاريخ',
      visible: true,
      date: true
    },
    {
      key: 'recordNo',
      label: 'رقم المستند',
      visible: true
    },
    {
      key: 'storeName',
      label: 'المستودع',
      visible: true
    },
    {
      key: 'storeKeeperName',
      label: 'أمين المستودع',
      visible: false
    },
    {
      key: 'pagesCount',
      label: 'عدد الصفحات',
      visible: true
    },
    {
      key: 'storeManagerName',
      label: 'مدير المستوع',
      visible: false
    },
    {
      key: 'attachments',
      label: 'المرفقات ',
      visible: false
    },
    {
      key: 'deliveryPersonName',
      label: 'المستلم',
      visible: false
    }, 
    {
      key: 'demandBranchName',
      label: 'جهة طلب الصرف',
      visible: false
    },
    {
      key: 'ownerName',
      label: 'صاحب الصلاحية',
      visible: false
    },
    {
      key: 'notes',
      label: ' ملاحظات  ',
      visible: false
    },
  ];

  constructor(private storesTrexService: StoresTrxesService) { }

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
