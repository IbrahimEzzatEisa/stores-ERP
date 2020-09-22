import { Component, OnInit, Input } from '@angular/core';
import { Config, FilterParams } from 'src/app/shared/models';
import { OrderItemsService } from 'src/app/shared/services/api/order-items.service';
import { TrxTypeIds } from 'src/app/shared/enums';
import { orderItems } from 'src/app/shared/models/order-items';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalService } from 'src/app/shared/services';
import { NotifierService } from 'angular-notifier';
import { TempReceiveNotificationItemsModalComponent } from '../temp-receive-notification-items-modal/temp-receive-notification-items-modal.component';

@Component({
  selector: 'app-temp-receive-notification-items',
  templateUrl: './temp-receive-notification-items.component.html',
})
export class TempReceiveNotificationItemsComponent implements OnInit {

  tableColumns:Config[]=[
    {
      key: 'lineNo',
      label: 'الرقم',
      visible: true
    },
    {
      key:'itemGroupId',
      label: 'المجموعة',
      visible: true
    },
    {
      key: 'itemName',
      label: 'اسم الصنف',
      visible: true
    },
    {
      key: 'unitId',
      label: 'رمز الوحدة',
      visible: true
    },
    {
      key: 'quantity',
      label: 'الكمية',
      visible: true
    },
    {
      key: 'notes',
      label: 'ملاحظات',
      visible: true
    }
  ];

  @Input() orderSerial: number;
  @Input() trxTypeId: number;
  @Input() disableEdit;

  filterParams = new FilterParams();
  items: orderItems[] = [];
  totalNumberOfPages: number;
  totalNumberOfItems: number;
  busyLoading: boolean = false;
  busyAddingAddItems: boolean = false;
  searchTimeout;

  constructor(private ordersItemService: OrderItemsService,
              private modalService: NgbModal,
              private swalService: SwalService,
              private notifier: NotifierService) { }

  ngOnInit() {
    this.filterParams.pageSize = 10;
    this.filterParams.searchValue = null;
     this.getAllItems();
  }
  
  ngOnChanges() {
    this.refresh();
  }
  refresh() {
    this.getAllItems();
  }

  getAllItems() {
    this.ordersItemService.getAll(TrxTypeIds.tempReceiveNotification, this.orderSerial, this.filterParams).subscribe(res => {
      this.items = res.result;
      this.filterParams.pageNumber = res.pagination.currentPage;
      this.filterParams.pageSize = res.pagination.itemsPerPage;
      this.totalNumberOfPages = res.pagination.totalPages;
      this.totalNumberOfItems = res.pagination.totalItems;
    }, err => {
      this.busyLoading = false;
    })
  }
  
  setPageSize(pageSize) {
    this.filterParams.pageNumber = 1;
    this.filterParams.pageSize = pageSize;
    this.getAllItems();
  }

  onSearch() {
    if(this.searchTimeout) clearTimeout(this.searchTimeout)
    this.searchTimeout = setTimeout(this.search.bind(this), 600);
  }
  removeSearch() {
    this.filterParams.searchValue = "";
    this.search();
  }
  search() {
    this.filterParams.pageNumber = 1;
    this.getAllItems();
  }
  sort(sortingParam) {
    this.filterParams.sortField = sortingParam.sortColumn;
    this.filterParams.sortDirection = sortingParam.sortDirection;
    this.getAllItems();
  }
  changePage(pageNumber) {
    this.filterParams.pageNumber = pageNumber;
    this.getAllItems();
  }


  openAddModel() {
    const modalRef = this.modalService.open(TempReceiveNotificationItemsModalComponent);
    const newOrderItem = new orderItems({
      orderSerial: this.orderSerial,
      trxTypeId: this.trxTypeId,
      fillWithDeafults: true
    })
    modalRef.componentInstance.resolve = {
      isEdit: false,
      itemModel: newOrderItem
    };
    modalRef.result.then(
      data => {
        this.refresh();
      },
      dismiss => {}
    );
  }
  openEditModel(orderItem) {
    const modalRef = this.modalService.open(TempReceiveNotificationItemsModalComponent);
    modalRef.componentInstance.resolve = {
      isEdit: true,
      itemModel: orderItem
    };
    modalRef.result.then(
      data => {
        this.refresh();
      },
      dismiss => {}
    );
  }

  delete(orderItem: orderItems) {
    this.swalService.showRemoveConfirmation(`رقم ${orderItem.lineNo}`).then(
      res => {
        if(res.value) {
          this.ordersItemService.delete(orderItem.trxTypeId, orderItem.orderSerial, orderItem.lineNo).subscribe(
            res => {
              this.refresh();
              this.notifier.notify("success", "تم الحذف بنجاح");
            },
            err => {
              const errMessage = err.message || "حدث خطأ اثناء الحذف!";
              this.notifier.notify("error", errMessage);
            }
          )
        }
      }
    )
  }

}

