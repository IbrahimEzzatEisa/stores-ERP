import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { StockTakingTrxItem, ItemGroup, Item, Unit } from 'src/app/shared/models';
import { StockTakingTrxItemsService, ItemGroupsService, ItemsService, UnitsService } from 'src/app/shared/services';
 
@Component({
  selector: 'app-stock-taking-trx-items-modal',
  templateUrl: './stock-taking-trx-items-modal.component.html'
})
export class StockTakingTrxItemsModalComponent implements OnInit {

  @Input() resolve;
  stockTakingTrxItem: StockTakingTrxItem;
  isEdit: boolean;
  itemGroups: ItemGroup[] = [];
  units: Unit[] = [];
  items: Item[] = [];

  busySaving: boolean = false;
  busyLoadingItemGroups: boolean = false;
  busyLoadingItems: boolean = false;
  busyLoadingUnits: boolean = false;

  constructor(
    private notifier: NotifierService,
    private modal: NgbActiveModal,
    private StockTakingTrxItemsService: StockTakingTrxItemsService,
    private itemsService: ItemsService,
    private itemGroupsService: ItemGroupsService,
    private unitsService: UnitsService
  ) {}
   

  ngOnInit() {
    this.resolve = this.resolve || {};
    this.stockTakingTrxItem = this.resolve.itemModel;
    this.isEdit = this.resolve.isEdit;
    if(this.isEdit) {
      this.getAllDropdowns();
    } else {
      this.getNewId();
      this.getDropDownItemGroups();
    }
  }


  getDropDownItemGroups() {
    this.busyLoadingItemGroups = true;
    this.itemGroupsService.getAll().subscribe(
      res => {
        this.itemGroups = res;
        this.busyLoadingItemGroups = false;
      },
      err => {
        this.busyLoadingItemGroups = false;
      }
    );
  }
  onSelectedItemGroupChange(itemGroup) {
    this.stockTakingTrxItem.itemGroupId = itemGroup.itemGroupId;
    this.stockTakingTrxItem.itemId = undefined;
    this.items = [];
    this.stockTakingTrxItem.unitId = undefined;
    this.units = [];
    this.getDropDownItems();
  }
  getDropDownItems() {
    this.busyLoadingItems = true;
    this.itemsService.getByItemsGroupId(this.stockTakingTrxItem.itemGroupId).subscribe(
      res => {
        this.items = res;
        this.busyLoadingItems = false;
      },
      err => {
        this.busyLoadingItems = false;
      }
    );
  }
  onSelectedItemChange(item?) {
    if(item) {
      this.stockTakingTrxItem.itemId = item.itemId;
    } else {
      if(this.items.findIndex(item => item.itemId == this.stockTakingTrxItem.itemId) === -1)
        return;
    }
    this.stockTakingTrxItem.unitId = undefined;
    this.units = [];
    this.getDropDownsUnits();
  }
  getDropDownsUnits() {
    this.busyLoadingUnits = true;
    this.unitsService.getByItemGroupIdAndItemId(this.stockTakingTrxItem.itemGroupId, this.stockTakingTrxItem.itemId).subscribe(
      res => {
        this.units = res;
        if(!this.stockTakingTrxItem.unitId && this.units[0]) {
          this.onSelectUnit(this.units[0]);
        }
        this.busyLoadingUnits = false;
      },
      err => {
        this.busyLoadingUnits = false;
      }
    );
  }
  onSelectUnit(unit) {
    this.stockTakingTrxItem.unitId = unit.unitId;
    this.stockTakingTrxItem.factor = unit.factor;
  }
  calcDeference() {
    console.log("this.stockTakingTrxItem.actualQuantity", this.stockTakingTrxItem.actualQuantity, typeof this.stockTakingTrxItem.actualQuantity)
    console.log("this.stockTakingTrxItem.quantity", this.stockTakingTrxItem.quantity, typeof this.stockTakingTrxItem.quantity);
    this.stockTakingTrxItem.difference = this.stockTakingTrxItem.actualQuantity - this.stockTakingTrxItem.quantity;
  }
  
  getNewId() {
    this.StockTakingTrxItemsService.getNewId(this.stockTakingTrxItem.serial).subscribe(
      res => {
        this.stockTakingTrxItem.lineNo = res;
      }
    )
  }
  getAllDropdowns() {
    this.getDropDownItemGroups();
    this.getDropDownItems();
    this.getDropDownsUnits();
  }
  
  save() {
    if(this.isEdit) {
      this.update();
    } else {
      this.create();
    }
  }
  close() {
    this.modal.close();
  }
  update() {
    this.busySaving = true;
    this.StockTakingTrxItemsService.update(this.stockTakingTrxItem).subscribe(
      res => {
        this.notifier.notify('success', 'تم التعديل  بنجاح');
        this.busySaving = false;
        this.modal.close();
      },
      err=> {
        this.busySaving = false;
        let errorMessage = err.message || 'حدث خطأ اثناء التعديل';
        this.notifier.notify('error',errorMessage)
      }
    );
  }
  create() {
    this.busySaving = true;
    this.StockTakingTrxItemsService.create(this.stockTakingTrxItem).subscribe(
      res => {
        this.notifier.notify('success', 'تمت الإضافة بنجاح');
        this.busySaving = false;
        this.modal.close();
      },
      err => {
        let errorMessage = err.message || 'حدث خطأ اثناء الإضافة';
        this.notifier.notify('error', errorMessage);
        this.busySaving = false;
      }
    );
  }
}
