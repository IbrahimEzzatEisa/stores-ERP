import { Component, OnInit, Input } from '@angular/core';
import { Config, FilterParams, CustodyTrxItems } from 'src/app/shared/models';
import { CustodyTrxItemsService, SwalService } from 'src/app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { CustodyTypes } from 'src/app/shared/enums';
import { CustodyRegisterTransfereItemsModalComponent } from '../custody-register-transfere-items-modal/custody-register-transfere-items-modal.component';

@Component({
  selector: 'app-custody-register-transfere-items',
  templateUrl: './custody-register-transfere-items.component.html'
})
export class CustodyRegisterTransfereItemsComponent implements OnInit {

  tableColumns:Config[]=[
    {
      key: 'lineNo',
      label: 'الرقم',
      visible: true
    },
    {
      key: 'itemGroupId',
      label: 'كود المجموعة',
      visible: true
    },
    {
      key: 'itemId',
      label: 'كود الصنف',
      visible: true
    },
    {
      key: 'itemName',
      label: 'اسم الصنف',
      visible: true
    },
    {
      key: 'quantity',
      label: 'الكمية',
      visible: true
    },
    {
      key: 'unitName',
      label: 'الوحدة',
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
  @Input() fromEmpId: number;
  @Input() pageCustodyType: number;

  filterParams = new FilterParams();
  items: CustodyTrxItems[] = [];
  totalNumberOfPages: number;
  totalNumberOfItems: number;
  busyLoading: boolean = false;
  busyAddingAddItems: boolean = false;
  searchTimeout;

  constructor(private custodyTrxItemsService: CustodyTrxItemsService,
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
    this.custodyTrxItemsService.getAll(this.pageCustodyType, this.orderSerial, this.filterParams).subscribe(res => {
      this.items = res.result.result;
      this.filterParams.pageNumber = res.pagination.currentPage;
      this.filterParams.pageSize = res.pagination.itemsPerPage;
      this.totalNumberOfPages = res.pagination.totalPages;
      this.totalNumberOfItems = res.pagination.totalItems;
    }, err => {
      this.busyLoading = false;
    })
  }
  
  addEmployeeItemsForTransfer() {
    this.custodyTrxItemsService.getEmployeeItems(this.trxTypeId, this.orderSerial, this.fromEmpId).subscribe(res => {
      this.items = res;
    }, err => {
      const errMessage = err.message || "حدث خطأ اثناء تعبئة الأصناف!";
      this.notifier.notify("error", errMessage);
    })
  }

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
    const modalRef = this.modalService.open(CustodyRegisterTransfereItemsModalComponent);
    const newOrderItem = new CustodyTrxItems({
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
    const modalRef = this.modalService.open(CustodyRegisterTransfereItemsModalComponent);
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

  delete(orderItem: CustodyTrxItems) {
    this.swalService.showRemoveConfirmation(`رقم ${orderItem.lineNo}`).then(
      res => {
        if(res.value) {
          this.custodyTrxItemsService.delete(orderItem.type, orderItem.serial, orderItem.lineNo).subscribe(
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
