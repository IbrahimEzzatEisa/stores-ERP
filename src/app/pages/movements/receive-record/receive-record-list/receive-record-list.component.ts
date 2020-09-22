import { Component, OnInit } from '@angular/core';
import { FilterParams, Order, Config } from 'src/app/shared/models';
import { OrdersService } from 'src/app/shared/services/api/orders.service';
import { TrxTypeIds } from 'src/app/shared/enums';

@Component({
  selector: 'app-receive-record-list',
  templateUrl: './receive-record-list.component.html'
})
export class ReceiveRecordListComponent implements OnInit {

  orders:Order[];
  filterParams = new FilterParams();
  totalNumberOfPages: number;
  totalNumberOfItems: number;
  busyLoading: boolean = false;

  configs:Config[]=[
    {
      key: 'orderSerial',
      label: ' الرقم الخاص ',
      visible: true
    },
    {//1
      key: 'trxTypeId',
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
      key: 'recordNo',
      label: 'الرقم المطبوع',
      visible: true
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
      key: 'assignmentYear',
      label: ' سنة الإنشاء ',
      visible: false
    },
    {
      key: 'assignmentSerial',
      label: ' رقم الإنشاء ',
      visible: false
    },
    {//7
      key: 'branchId',
      label: '  إدارة مستودعات ',
      visible: false
    },
    {
      key: 'managerId',
      label: ' الرئيس المسئول ',
      visible: false
    }, 
    {//9
      key: 'storeId',
      label: 'كود المستودع ',
      visible: false
    },
    {//10
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
      label: 'تاريخه ',
      visible: false,
      date: true
    },
    {
      key: 'recipientId',
      label: ' المستلم ',
      visible: true

    },
    {
      key: 'techMemberId',
      label: 'العضو الفنى  ',
      visible: false,
      date: true

    },
    {
      key: 'notes',
      label: ' ملاحظات  ',
      visible: false
    },
    {
      key: 'total',
      label: 'إجمالى المبلغ ',
      visible: false
    },
    {
      key: 'discountValue',
      label: 'الخصم ',
      visible: false
    }
    ,
    {
      key: 'totalVat',
      label: 'الضريبة ',
      visible: false
    }
    ,
    {
      key: 'net',
      label: 'الصافى ',
      visible: false
    }
  ];

  constructor(
    private ordersService: OrdersService
  ) { }

  ngOnInit() {
    this.filterParams.pageSize = 10;
    this.getAllOrders();
  }
 
  getAllOrders(){
    this.busyLoading = true;
    this.ordersService.getAll(TrxTypeIds.recieveRecord, this.filterParams).subscribe(
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
