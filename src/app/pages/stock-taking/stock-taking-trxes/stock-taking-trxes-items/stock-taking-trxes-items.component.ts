import { Component, OnInit, Input } from '@angular/core';
import { FilterParams, StockTakingTrxItem, StockTakingTrxItemWithNames } from 'src/app/shared/models';
import { StockTakingTrxItemsService } from 'src/app/shared/services';
import { StockTakingTrxItemsModalComponent } from '../stock-taking-trx-items-modal/stock-taking-trx-items-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalService } from 'src/app/shared/services';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-stock-taking-trxes-items',
  templateUrl: './stock-taking-trxes-items.component.html'
})
export class StockTakingTrxesItemsComponent implements OnInit {

  @Input() serial: number;

  stockTakingTrxItems: StockTakingTrxItemWithNames[] = [];
  filterParams = new FilterParams();
  totalNumberOfPages: number;
  totalNumberOfItems: number;
  busyLoading: boolean = false;
  searchTimeout;
  constructor(
    private stockTakingTrxItemsService: StockTakingTrxItemsService,
    private modalService: NgbModal,
    private swalService: SwalService,
    private notifier: NotifierService

  ) {
    this.filterParams.searchValue = "";
    this.filterParams.pageSize = 10;
    this.filterParams.pageNumber = 1;
   }

  ngOnInit() {
  
  }
  ngOnChanges(){
    this.getAllStockTakingTrxes();
  }
  getAllStockTakingTrxes(){
    this.busyLoading = true;
    this.stockTakingTrxItemsService.getAll(this.serial, this.filterParams).subscribe(
      res => {
        this.stockTakingTrxItems = res.result;
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
    const modalRef = this.modalService.open(StockTakingTrxItemsModalComponent);
    const newStockTakingTrxItems = new StockTakingTrxItem();
    newStockTakingTrxItems.serial = this.serial;
    modalRef.componentInstance.resolve = {
      isEdit: false,
      itemModel: newStockTakingTrxItems
    };
    modalRef.result.then(
      data => {
        this.getAllStockTakingTrxes();
      },
      dismiss => {}
    );
  }
  openEditModel(stockTakingTrxItem: StockTakingTrxItemWithNames) {
    const modalRef = this.modalService.open(StockTakingTrxItemsModalComponent);
    modalRef.componentInstance.resolve = {
      isEdit: true,
      itemModel: stockTakingTrxItem
    };
    modalRef.result.then(
      data => {
        this.getAllStockTakingTrxes();
      },
      dismiss => {}
    );
  }
  delete(stockTakingTrxItem: StockTakingTrxItemWithNames){
    this.swalService.showRemoveConfirmation(`رقم ${stockTakingTrxItem.lineNo}`).then(
      res => {
        if(res.value) {
          this.stockTakingTrxItemsService.delete(stockTakingTrxItem.serial, stockTakingTrxItem.lineNo).subscribe(
            res => {
              this.getAllStockTakingTrxes();
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
    this.getAllStockTakingTrxes();
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
    this.getAllStockTakingTrxes();
  }
  sort(sortField, sortDirection) {
    // TODO
  }
  changePage(pageNumber) {
    this.filterParams.pageNumber = pageNumber;
    this.getAllStockTakingTrxes();
  }
}
