import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FilterParams, MngrOrdersItem } from 'src/app/shared/models';
import { MngrOrdersItemService } from 'src/app/shared/services/api/mngr-orders-item.service';
import { MngrOrdersItemsModalComponent } from '../mngr-orders-items-modal/mngr-orders-items-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalService } from 'src/app/shared/services';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-mngr-orders-items',
  templateUrl: './mngr-orders-items.component.html',
  styleUrls: ['./mngr-orders-items.component.css']
})
export class MngrOrdersItemsComponent implements OnChanges, OnInit {
  @Input() serial:number;
  @Input() disableEdit;

  mngrOrdersItems: MngrOrdersItem[] = [];
  filterParams = new FilterParams();
  totalNumberOfPages: number;
  totalNumberOfItems: number;
  busyLoading: boolean = false;
  searchTimeout;
  constructor(
    private mngrOrderItemService:MngrOrdersItemService,
    private modalService: NgbModal,
    private swalService: SwalService,
    private notifier: NotifierService

  ) {
    this.filterParams.searchValue = "";
    this.filterParams.pageSize = 10;
    this.filterParams.pageNumber = 1;
   }

  ngOnInit() {
    console.log(this.disableEdit);
  }
  ngOnChanges(){
    this.getAllMngrOrders();
  }
  getAllMngrOrders(){
    this.busyLoading = true;
    this.mngrOrderItemService.getAll(this.serial,this.filterParams).subscribe(
      res=>{
        this.mngrOrdersItems=res.result;
        this.filterParams.pageNumber = res.pagination.currentPage;
        this.filterParams.pageSize = res.pagination.itemsPerPage;
        this.totalNumberOfPages = res.pagination.totalPages;
        this.totalNumberOfItems = res.pagination.totalItems;
        this.busyLoading = false;
      },
      err=>{
        this.busyLoading = false;

      }
    );

  }
  openAddModel() {
    const modalRef = this.modalService.open(MngrOrdersItemsModalComponent);
    const newMngrOrdersItem = new MngrOrdersItem();
    newMngrOrdersItem.serial = this.serial;
    modalRef.componentInstance.resolve = {
      isEdit: false,
      itemModel: newMngrOrdersItem
    };
    modalRef.result.then(
      data => {
        this.getAllMngrOrders();
      },
      dismiss => {}
    );
  }
  openEditModel(mngrOrdersItem: MngrOrdersItem) {
    const modalRef = this.modalService.open(MngrOrdersItemsModalComponent);
    modalRef.componentInstance.resolve = {
      isEdit: true,
      itemModel: mngrOrdersItem
    };
    modalRef.result.then(
      data => {
        this.getAllMngrOrders();
      },
      dismiss => {}
    );
  }
  delete(MngrOrdersItem:MngrOrdersItem){
    this.swalService.showRemoveConfirmation(`رقم ${MngrOrdersItem.lineNo}`).then(
      res => {
        if(res.value) {
          this.mngrOrderItemService.delete(MngrOrdersItem.serial, MngrOrdersItem.lineNo).subscribe(
            res => {
              this.getAllMngrOrders();
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
  setPageSize(pageSize) {
    this.filterParams.pageNumber = 1;
    this.filterParams.pageSize = pageSize;
    this.getAllMngrOrders();
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
    this.getAllMngrOrders();
  }
  sort(sortField, sortDirection) {
    // TODO
  }
  changePage(pageNumber) {
    this.filterParams.pageNumber = pageNumber;
    this.getAllMngrOrders();
  }

}
