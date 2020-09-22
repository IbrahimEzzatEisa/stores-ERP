import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { NgForm } from '@angular/forms';

import { itemsTableColumns } from '../table-columns';
import { StoresTrxItemsService, ItemsService, ItemGroupsService, UnitsService } from 'src/app/shared/services/api';
import { StoresTrxItem, ItemGroup, Item, Unit, ItemUnits, TableConfig } from 'src/app/shared/models';
import { TrxTypeIds } from 'src/app/shared/enums';

@Component({
  selector: 'app-add-edit-item-table-modal',
  templateUrl: './add-edit-item-table-modal.component.html',
})
export class AddEditItemTableModalComponent implements OnInit {

  @Input() resolve;
  
  storesTrxItem: StoresTrxItem;
  isEdit: boolean;
  formFields: TableConfig[];
  itemGroups: ItemGroup[] = [];
  units: Unit[] = [];
  items: Item[] = [];

  busySaving: boolean = false;
  busyLoadingItemGroups: boolean = false;
  busyLoadingItems: boolean = false;
  busyLoadingUnits: boolean = false;

  isOpeningPalance: boolean = false;
  isReceiveNote: boolean = false;
  isItemOutOrder: boolean = false;
  isDamagedSettlement: boolean = false;
  isReturnDocument: boolean = false;
  isTransferCustody: boolean = false;
  @ViewChild('form') form: NgForm;

  constructor(
    private notifier: NotifierService,
    private modal: NgbActiveModal,
    private storeTrxItemsService: StoresTrxItemsService,
    private itemsService: ItemsService,
    private itemGroupsService: ItemGroupsService,
    private unitsService: UnitsService,
  ) { }

  ngOnInit() {

    this.resolve = this.resolve || {};
    this.storesTrxItem = this.resolve.itemModel;
    this.isEdit = this.resolve.isEdit;
    if(this.isEdit) {
      this.getAllDropdowns();
    } else {
      this.getNewId();
      this.getDropDownItemGroups();
    }

    switch(this.storesTrxItem.trxTypeId) {
      case TrxTypeIds.openingBalance: 
        this.storesTrxItem.demandQuantity = 0;
        this.storesTrxItem.discountRatio = 0;
        this.storesTrxItem.discountValue = 0;
        this.storesTrxItem.factor = 1;
        this.storesTrxItem.net = 0;
        this.storesTrxItem.price = 0;
        this.storesTrxItem.totalPrice = 0;
        this.storesTrxItem.totalQuantity = 0;
        this.isOpeningPalance = true;
        break;
      case TrxTypeIds.receiveNote:
        this.isReceiveNote = true;
        break;
      case TrxTypeIds.itemOutOrder:
        this.isItemOutOrder = true
        break;
      case TrxTypeIds.damagedSettlement:
        this.isDamagedSettlement = true
        this.isOpeningPalance = true;
        break;
      case TrxTypeIds.returnDocument:
        this.isReturnDocument=true;
        break;
      case TrxTypeIds.transferCustody:
        this.isTransferCustody=true;
        break;  
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
  onSelectedItemGroupChange(itemGroup: ItemGroup) {
    this.storesTrxItem.itemGroupId = itemGroup.itemGroupId+'';
    this.storesTrxItem.itemId = undefined;
    this.items = [];
    this.storesTrxItem.unitId = undefined;
    this.units = [];
    this.getDropDownItems();
  }
  getDropDownItems() {
    this.busyLoadingItems = true;
    this.itemsService.getByItemsGroupId(this.storesTrxItem.itemGroupId, this.storesTrxItem.itemYear).subscribe(
      res => {
        this.items = res;
        this.busyLoadingItems = false;
      },
      err => {
        this.busyLoadingItems = false;
      }
    );
  }
  onSelectedItemChange(item?: Item) {
    if(item) {
      this.storesTrxItem.itemId = item.itemId;
    } else {
      if(this.items.findIndex(item => item.itemId == this.storesTrxItem.itemId) === -1 )
        return;
    }
    this.storesTrxItem.unitId = undefined;
    this.units = [];
    this.getDropDownsUnits();
  }
  getDropDownsUnits() {
    this.busyLoadingUnits = true;
    this.unitsService.getByItemGroupIdAndItemId(this.storesTrxItem.itemGroupId, this.storesTrxItem.itemId, this.storesTrxItem.itemYear).subscribe(
      res => {
        this.units = res;
        if(!this.storesTrxItem.unitId && this.units[0]) {
          this.onSelectUnit(this.units[0]);
        }
        this.busyLoadingUnits = false;
      },
      err => {
        this.busyLoadingUnits = false;
      }
    );
  }

  getNewId() {
    this.storeTrxItemsService.getNewId(this.storesTrxItem.trxTypeId, this.storesTrxItem.trxSerial).subscribe(
      res => {
        this.storesTrxItem.lineNo = res;
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
    this.modal.dismiss();
  }

  update() {
    this.busySaving = true;
    this.storeTrxItemsService.update(this.storesTrxItem).subscribe(
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
    this.storeTrxItemsService.create(this.storesTrxItem).subscribe(
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

  onSelectUnit(unit: Unit) {
    this.storesTrxItem.unitId = unit.unitId;
    this.storesTrxItem.factor = unit.factor;
    this.calcTotalQuantity();
  }
  calcTotalPrice() {
    if(!this.storesTrxItem.quantity || !this.storesTrxItem.price)
      return this.storesTrxItem.totalPrice = 0;
    if(this.storesTrxItem.trxTypeId === TrxTypeIds.itemOutOrder) {
      this.storesTrxItem.totalPrice = (this.storesTrxItem.quantity * this.storesTrxItem.price);
    } else {
      this.storesTrxItem.totalPrice = (this.storesTrxItem.quantity * this.storesTrxItem.price) - this.storesTrxItem.discountValue;
    }
  }
  calcTotalQuantity() {
    if(!this.storesTrxItem.quantity || !this.storesTrxItem.factor ) 
      return this.storesTrxItem.totalQuantity = 0;
    this.storesTrxItem.totalQuantity = this.storesTrxItem.quantity * this.storesTrxItem.factor;
  }
}
