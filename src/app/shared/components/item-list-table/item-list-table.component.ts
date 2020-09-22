import { Component, OnInit, Input, OnChanges, Output, EventEmitter, ViewChild } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TrxTypeIds } from 'src/app/shared/enums';
import { itemsTableColumns } from './table-columns';
import { FilterParams, StoresTrxItem, TableConfig, ItemGroup } from 'src/app/shared/models';
import { SwalService } from 'src/app/shared/services';
import { StoresTrxItemsService } from '../../services/api';
import { AddEditItemTableModalComponent } from './add-edit-item-table-modal';
import { AddAllItemsModalComponent } from './add-all-items-modal';

@Component({
  selector: 'app-item-list-table',
  templateUrl: './item-list-table.component.html',
  styleUrls: ['./item-list-table.component.css']
})
export class ItemListTableComponent implements OnChanges, OnInit {

  
  @Input() trxTypeId: number;
  @Input() trxSerial: number;
  @Input() disableEdit: boolean;

  @Input() viewPrintBtn: boolean;
  @Input() busyPrinting: boolean;

  @Output() print = new EventEmitter();
  @Output() onTotalChange = new EventEmitter<number>()

  storesTrxItems: StoresTrxItem[] = [];
  tableColumns: TableConfig[];
  
  filterParams = new FilterParams();
  totalNumberOfPages: number;
  totalNumberOfItems: number;
  busyLoading: boolean = false;
  busyAddingAddItems: boolean = false;
  showAddAllItemsBtn: boolean = false;
  searchTimeout;

  constructor(
    private storeTrxItemsService: StoresTrxItemsService,
    private modalService: NgbModal,
    private swalService: SwalService,
    private notifier: NotifierService
  ) {
    this.filterParams.searchValue = "";
    this.filterParams.pageSize = 10;
    this.filterParams.pageNumber = 1;
   }

  ngOnInit() {
    switch(this.trxTypeId) {
      case TrxTypeIds.openingBalance: 
        this.tableColumns = itemsTableColumns.openingPalance;
        this.showAddAllItemsBtn = true;
        break;
      case TrxTypeIds.receiveNote:
        this.tableColumns = itemsTableColumns.receiveNote;
        break;
      case TrxTypeIds.itemOutOrder:
        this.tableColumns = itemsTableColumns.itemOutOrder;
        break;
      case TrxTypeIds.damagedSettlement:
        this.tableColumns=itemsTableColumns.damagedSettlement;
      case TrxTypeIds.returnDocument:
        this.tableColumns= itemsTableColumns.returnDocument;
      case TrxTypeIds.transferCustody:
        this.tableColumns= itemsTableColumns.transferCustody;
    }
  }

  ngOnChanges() {
    this.refresh();
  }
  refresh() {
    this.getAllItems();
  }

  getAllItems() {
    this.busyLoading = true;
    this.storeTrxItemsService.getAll(this.trxTypeId, this.trxSerial, this.filterParams).subscribe(
      res => {
        this.storesTrxItems = res.result.result;
        this.onTotalChange.emit(res.result.total);
        this.filterParams.pageNumber = res.pagination.currentPage;
        this.filterParams.pageSize = res.pagination.itemsPerPage;
        this.totalNumberOfPages = res.pagination.totalPages;
        this.totalNumberOfItems = res.pagination.totalItems;
        this.busyLoading = false;
      },
      err => {
        this.busyLoading = false;
      }
    );
  }

  addAllItems() {
    this.swalService.showConfirmation({
      title: 'هل تود الإستمرار؟',
      message: 'سيتم إلغاء بيانات الأصناف الموجودة وإعادة إدخالها من جديد'
    }).then(
      data => {
        if(data.dismiss) return;
        this.busyAddingAddItems = true;
        this.storeTrxItemsService.addAllItemsForOpenBalance(this.trxTypeId, this.trxSerial).subscribe(
          res => {
            this.busyAddingAddItems = false;
            this.refresh();
            this.notifier.notify("success", "تم إضافة جميع الأصناف");
          },
          err => {
            this.busyAddingAddItems = false;
            const errMessage = err.message || "حدث خطأ اثناء إضافة جميع الأصناف!";
            this.notifier.notify("error", errMessage);
          }
        )
      },
      () => {}
    )
  }
  addAllItemsByItemGroupId(groupId, groupName) {
    this.swalService.showConfirmation({
      title: 'هل تود الإستمرار؟',
      message: `سيتم إلغاء بيانات الأصناف الموجودة وإدخال عناصر ${groupName}`
    }).then(
      data => {
        if(data.dismiss) return;
        this.busyAddingAddItems = true;
        this.storeTrxItemsService.AddAllItemsForOpenBalanceByItemGroupId(groupId, this.trxTypeId, this.trxSerial).subscribe(
          res => {
            this.busyAddingAddItems = false;
            this.refresh();
            this.notifier.notify("success", ` تم إضافة جميع الأصناف لمجموعة ال${groupName}`);
          },
          err => {
            this.busyAddingAddItems = false;
            const errMessage = err.message || `حدث خطأ اثناء إضافة جميع الأصناف ل${groupName}!`;
            this.notifier.notify("error", errMessage);
          }
        )
      },
      () => {}
    )
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
    const modalRef = this.modalService.open(AddEditItemTableModalComponent);
    const newstoresTrxItem = new StoresTrxItem({
      trxSerial: this.trxSerial,
      trxTypeId: this.trxTypeId,
      fillWithDeafults: true
    })
    modalRef.componentInstance.resolve = {
      isEdit: false,
      itemModel: newstoresTrxItem
    };
    modalRef.result.then(
      data => {
        this.refresh();
      },
      dismiss => {}
    );
  }
  openEditModel(storeTrxItem) {
    const modalRef = this.modalService.open(AddEditItemTableModalComponent);
    modalRef.componentInstance.resolve = {
      isEdit: true,
      itemModel: storeTrxItem
    };
    modalRef.result.then(
      data => {
        this.refresh();
      },
      dismiss => {}
    );
  }

  delete(storeTrxItem: StoresTrxItem) {
    this.swalService.showRemoveConfirmation(`رقم ${storeTrxItem.lineNo}`).then(
      res => {
        if(res.value) {
          this.storeTrxItemsService.delete(storeTrxItem.trxTypeId, storeTrxItem.trxSerial, storeTrxItem.lineNo).subscribe(
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

  showAddAllItemsModal() {
    const modalRef = this.modalService.open(AddAllItemsModalComponent, {centered: true});
    modalRef.result.then(
      (selectedItem: ItemGroup) => {
        if(selectedItem.itemGroupId) {
          this.addAllItemsByItemGroupId(selectedItem.itemGroupId, selectedItem.itemGroupName);
        } else {
          this.addAllItems();
        }
      },
      dismiss => {

      }
    )
  }
  
  printReport() {
    this.print.emit();
  }

}