import { Component, OnInit } from '@angular/core';
import { FilterParams, Order, Config } from 'src/app/shared/models';
import { OrdersService } from 'src/app/shared/services/api/orders.service';
import { TrxTypeIds } from 'src/app/shared/enums';
@Component({
  selector: 'app-temp-receive-notification-list',
  templateUrl: './temp-receive-notification-list.component.html',
  styleUrls: ['./temp-receive-notification-list.component.css']
})
export class TempReceiveNotificationListComponent implements OnInit {
 
  orders: Order[];
  filterParams = new FilterParams();
  totalNumberOfPages: number;
  totalNumberOfItems: number;
  busyLoading: boolean = false;

  configs: Config[] = [
    {
      key: 'orderSerial',
      label: ' الرقم الخاص ',
      visible: true
    },
    {//1
      key: 'storeId',
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
      label: 'عدد الصفحات ',
      visible: false
    },
    {
      key: 'attachments',
      label: 'المرفقات ',
      visible: false
    },
    {
      key: 'storeKeeperId',
      label: 'أمين المستودع ',
      visible: false
    },
    {
      key: 'storeManagerId',
      label: 'مدير المستودع ',
      visible: false
    },
    {
      key: 'supplierId',
      label: ' كود المورد',
      visible: false
    },
    {
      key: 'docDescription',
      label: ' المستند ',
      visible: false,

    },
    {//11
      key: 'docNo',
      label: ' رقم المستند ',
      visible: false
    }, {
      key: 'docDate',
      label: 'تاريخ المستند ',
      visible: false,
      date: true
    },
    {
      key: 'recipientId',
      label: ' المسلم ',
      visible: true

    },
    {
      key: 'notes',
      label: ' ملاحظات  ',
      visible: false
    },
  ];

  constructor(
    private ordersService: OrdersService
  ) { }

  ngOnInit() {
    this.filterParams.pageSize = 10;
    this.getAllOrders();
  }

  getAllOrders() {
    this.busyLoading = true;
    this.ordersService.getAll(TrxTypeIds.tempReceiveNotification, this.filterParams).subscribe(
      res => {
        this.orders = res.result;
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
    this.getAllOrders();
  }
  search(queryString) {
    this.filterParams.pageNumber = 1;
    this.filterParams.searchValue = queryString;
    this.getAllOrders();
  }
  sort(sortParams) {
    this.filterParams.pageNumber = 1;
    this.filterParams.sortField = sortParams.sortColumn;
    this.filterParams.sortDirection = sortParams.sortDirection;
    this.getAllOrders();
  }
  changePage(pageNumber) {
    this.filterParams.pageNumber = pageNumber;
    this.getAllOrders();
  }

}

