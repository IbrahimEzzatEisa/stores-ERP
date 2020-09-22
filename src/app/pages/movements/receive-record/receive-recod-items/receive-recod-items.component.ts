import { Component, OnInit, Input } from '@angular/core';
import { Config, FilterParams } from 'src/app/shared/models';
import { OrderItemsService } from 'src/app/shared/services/api/order-items.service';
import { TrxTypeIds } from 'src/app/shared/enums';
import { orderItems } from 'src/app/shared/models/order-items';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReceiveRecodItemsModalComponent } from '../receive-recod-items-modal/receive-recod-items-modal.component';
import { SwalService } from 'src/app/shared/services';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-receive-recod-items',
  templateUrl: './receive-recod-items.component.html'
})
export class ReceiveRecodItemsComponent implements OnInit {

  tableColumns:Config[]=[
    {
      key: 'lineNo',
      label: 'الرقم',
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
      key: 'price',
      label: 'السعر',
      visible: true
    },
    {
      key: 'totalPrice',
      label: 'مجموع القيمة',
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
    this.ordersItemService.getAll(TrxTypeIds.recieveRecord, this.orderSerial, this.filterParams).subscribe(res => {
      this.items = res.result;
      this.filterParams.pageNumber = res.pagination.currentPage;
      this.filterParams.pageSize = res.pagination.itemsPerPage;
      this.totalNumberOfPages = res.pagination.totalPages;
      this.totalNumberOfItems = res.pagination.totalItems;
    }, err => {
      this.busyLoading = false;
    })
  }

  // addAllItems() {
  //   this.busyAddingAddItems = true;
  //   this.storeTrxItemsService.addAllItemsForOpenBalance(this.trxTypeId, this.trxSerial).subscribe(
  //     res => {
  //       this.busyAddingAddItems = false;
  //       this.refresh();
  //       this.notifier.notify("success", "تم إضافة جميع الأصناف");
  //     },
  //     err => {
  //       this.busyAddingAddItems = false;
  //       const errMessage = err.message || "حدث خطأ اثناء إضافة جميع الأصناف!";
  //       this.notifier.notify("error", errMessage);
  //     }
  //   )
  // }
  
  setPageSize(pageSize) {
    this.filterParams.pageNumber = 1;
    this.filterParams.pageSize = pageSize;
    this.getAllItems();
  }

  onSeach() {
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
    const modalRef = this.modalService.open(ReceiveRecodItemsModalComponent);
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
    const modalRef = this.modalService.open(ReceiveRecodItemsModalComponent);
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
