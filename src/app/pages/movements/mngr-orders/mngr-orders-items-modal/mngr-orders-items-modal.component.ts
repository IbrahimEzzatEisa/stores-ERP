import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ItemGroup, Item, MngrOrdersItem } from 'src/app/shared/models';
import { NgForm } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemsService, ItemGroupsService } from 'src/app/shared/services';
import { MngrOrdersItemService } from 'src/app/shared/services/api/mngr-orders-item.service';

@Component({
  selector: 'app-mngr-orders-items-modal',
  templateUrl: './mngr-orders-items-modal.component.html',
  styleUrls: ['./mngr-orders-items-modal.component.css']
})
export class MngrOrdersItemsModalComponent implements OnInit {
  @Input() resolve;
  mngrOrdersItem: MngrOrdersItem;
  isEdit: boolean;
  itemGroups: ItemGroup[] = [];
  items: Item[] = [];
  busySaving: boolean = false;
  busyLoadingItemGroups: boolean = false;
  busyLoadingItems: boolean = false;

  constructor(
    private notifier: NotifierService,
    private modal: NgbActiveModal,
    private itemsService: ItemsService,
    private itemGroupsService: ItemGroupsService,
    private mngrOrderItemService:MngrOrdersItemService,
  ) {}
   

  ngOnInit() {
    this.resolve = this.resolve || {};
    this.mngrOrdersItem = this.resolve.itemModel;
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
    this.mngrOrdersItem.itemGroupId = itemGroup.itemGroupId;
    this.mngrOrdersItem.itemId = undefined;
    this.items = [];
    this.getDropDownItems(); 
  }
  getDropDownItems() {
    this.busyLoadingItems = true;
    this.itemsService.getByItemsGroupId(this.mngrOrdersItem.itemGroupId, this.mngrOrdersItem.itemYear).subscribe(
      res => {
        this.items = res;
        this.busyLoadingItems = false;
      },
      err => {
        this.busyLoadingItems = false;
      }
    );
  }
  onSelectedItemChange(item: Item) {
    this.mngrOrdersItem.itemId = item.itemId;
  }
  
  getNewId() {
    this.mngrOrderItemService.getNewId(this.mngrOrdersItem.serial).subscribe(
      res => {
        this.mngrOrdersItem.lineNo = res;
      }
    )
  }
  getAllDropdowns() {
    this.getDropDownItemGroups();
    this.getDropDownItems();
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
    this.mngrOrderItemService.update(this.mngrOrdersItem).subscribe(
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
    this.mngrOrderItemService.create(this.mngrOrdersItem).subscribe(
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
