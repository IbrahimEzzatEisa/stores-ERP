import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { orderItems } from 'src/app/shared/models/order-items';
import { TableConfig, ItemGroup, Unit, Item } from 'src/app/shared/models';
import { NgForm } from '@angular/forms';
import { ItemsService, ItemGroupsService, UnitsService } from 'src/app/shared/services';
import { OrderItemsService } from 'src/app/shared/services/api/order-items.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { TrxTypeIds } from 'src/app/shared/enums';

@Component({
  selector: 'app-receive-recod-items-modal',
  templateUrl: './receive-recod-items-modal.component.html'
})
export class ReceiveRecodItemsModalComponent implements OnInit {

  @Input() resolve;

  orderItems: orderItems;
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

  @ViewChild('form') form: NgForm;

  constructor(private notifier: NotifierService,
              private itemsService: ItemsService,
              private itemGroupsService: ItemGroupsService,
              private unitsService: UnitsService,
              private orderItemsService: OrderItemsService,
              private modal: NgbActiveModal) { }

  ngOnInit() {
    this.resolve = this.resolve || {};
    this.orderItems = this.resolve.itemModel;
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
  onSelectedItemGroupChange(group: ItemGroup) {
    this.orderItems.itemGroupId = group.itemGroupId+'';
    this.orderItems.itemId = undefined;
    this.items = [];
    this.orderItems.unitId = undefined;
    this.units = [];
    this.getDropDownItems();
  }
  getDropDownItems() {
    this.busyLoadingItems = true;
    this.itemsService.getByItemsGroupId(this.orderItems.itemGroupId).subscribe(
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
      this.orderItems.itemId = item.itemId;    
      this.orderItems.itemName = item.itemName;
    } else {
      if(this.items.findIndex(item => item.itemId == this.orderItems.itemId) === -1)
        return;
      this.orderItems.itemName = this.items.find(item => item.itemId == this.orderItems.itemId).itemName;
    }
    this.orderItems.unitId = undefined;
    this.units = [];
    this.getDropDownsUnits();
  }
  getDropDownsUnits() {
    this.busyLoadingUnits = true;
    this.unitsService.getByItemGroupIdAndItemId(this.orderItems.itemGroupId, this.orderItems.itemId).subscribe(
      res => {
        this.units = res;
        if(!this.orderItems.unitId && this.units[0]) {
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
    this.orderItemsService.getNewId(this.orderItems.trxTypeId, this.orderItems.orderSerial).subscribe(
      res => {
        this.orderItems.lineNo = res;
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
    this.orderItemsService.update(this.orderItems).subscribe(
      res => {
        this.notifier.notify('success', 'تم التعديل  بنجاح');
        this.busySaving = false;
        this.modal.close(res);
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
    this.orderItemsService.create(this.orderItems).subscribe(
      res => {
        this.notifier.notify('success', 'تمت الإضافة بنجاح');
        this.busySaving = false;
        this.modal.close(res);
      },
      err => {
        let errorMessage = err.message || 'حدث خطأ اثناء الإضافة';
        this.notifier.notify('error', errorMessage);
        this.busySaving = false;
      }
    );
  }

  onSelectUnit(unit: Unit) {
    this.orderItems.unitId = unit.unitId;
    this.orderItems.factor = unit.factor;
    this.calcTotalQuantity();
  }
  calcTotalPrice() {
    if(!this.orderItems.quantity || !this.orderItems.price)
      return this.orderItems.totalPrice = 0;
    this.orderItems.totalPrice = (this.orderItems.quantity * this.orderItems.price) - this.orderItems.discountValue;
  }
  calcTotalQuantity() {
    if(!this.orderItems.quantity || this.orderItems.factor ) 
      return this.orderItems.totalQuantity = 0;
    this.orderItems.totalQuantity = this.orderItems.quantity * this.orderItems.factor;
  }

}
