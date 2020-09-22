import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CustodyTrxItems, TableConfig, ItemGroup, Unit, Item } from 'src/app/shared/models';
import { NgForm } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ItemGroupsService, UnitsService, CustodyTrxItemsService, ItemsService } from 'src/app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-custody-register-transfere-items-modal',
  templateUrl: './custody-register-transfere-items-modal.component.html'
})
export class CustodyRegisterTransfereItemsModalComponent implements OnInit {

  @Input() resolve;

  custodyItem: CustodyTrxItems;
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
  // isItemOutOrder: boolean = false;

  @ViewChild('form') form: NgForm;

  constructor(private notifier: NotifierService,
              private itemsService: ItemsService,
              private itemGroupsService: ItemGroupsService,
              private unitsService: UnitsService,
              private custodyTrxItemsService: CustodyTrxItemsService,
              private modal: NgbActiveModal) { }

  ngOnInit() {
    this.resolve = this.resolve || {};
    this.custodyItem = this.resolve.itemModel;
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
    this.custodyItem.itemGroupId = group.itemGroupId+'';
    this.custodyItem.itemId = undefined;
    this.items = [];
    this.custodyItem.unitId = undefined;
    this.units = [];
    this.getDropDownItems();
  }
  getDropDownItems() {
    this.busyLoadingItems = true;
    this.itemsService.getByItemsGroupId(this.custodyItem.itemGroupId).subscribe(
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
      this.custodyItem.itemId = item.itemId;    
      this.custodyItem.itemName = item.itemName;
    } else {
      if(this.items.findIndex(item => item.itemId == this.custodyItem.itemId) === -1)
        return;
      this.custodyItem.itemName = this.items.find(item => item.itemId == this.custodyItem.itemId).itemName;
    }
    this.custodyItem.unitId = undefined;
    this.units = [];
    this.getDropDownsUnits();
  }
  getDropDownsUnits() {
    this.busyLoadingUnits = true;
    this.unitsService.getByItemGroupIdAndItemId(this.custodyItem.itemGroupId, this.custodyItem.itemId).subscribe(
      res => {
        this.units = res;
        if(!this.custodyItem.unitId && this.units[0]) {
          this.onSelectUnit(this.units[0]);
        }
        this.busyLoadingUnits = false;
      },
      err => {
        this.busyLoadingUnits = false;
      }
    );
  }
  onSelectUnit(unit: Unit) {
    this.custodyItem.unitId = unit.unitId;
    this.custodyItem.factor = unit.factor;
  }

  getNewId() {
    this.custodyTrxItemsService.getNewId(this.custodyItem.type, this.custodyItem.serial).subscribe(
      res => {
        this.custodyItem.lineNo = res;
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
    this.custodyTrxItemsService.update(this.custodyItem).subscribe(
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
    this.custodyTrxItemsService.create(this.custodyItem).subscribe(
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
