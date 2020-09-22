import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';
import { forkJoin } from 'rxjs';
import { svgAsPngUri, saveSvgAsPng } from 'save-svg-as-png';

import {
  ItemsService,
  ItemGroupsService,
  StoresService,
  StoreSectionsService,
  UnitsService,
  ItemTypesService,
  ObjectsOperationsService,
  SwalService,
  DateService,
  PermissionsService,
  PERMISSIONS
} from 'src/app/shared/services';
import { Item, ItemGroup, TableConfig, ItemType, StoreSection, Store, ResultWithRanking, Permission } from 'src/app/shared/models';
import { ObjectStatus } from 'src/app/shared/enums';
import { DropdownListComponent } from 'src/app/shared/components';

@Component({
  selector: 'app-items',
  templateUrl: './items-add-edit.component.html',
  styleUrls: ['./items-add-edit.component.css']
})
export class ItemsAddEditComponent implements OnInit {

  item: Item;
  itemPackup: Item;
  itemGroups: ItemGroup[];
  itemTypes: ItemType[];
  stores: Store[];
  storeSections: StoreSection[];

  rank: number;
  totalCount: number;

  isEdit: boolean = false;
  busySaving: boolean = false;
  dropdownsLoading: boolean = false;
  permission: Permission;
  busyPrinting: boolean = false;

  itemGroupsTableConfig: TableConfig[] = [
    {
      label: "الوحدة",
      key: "unitId"
    }, {
      label: "المعامل",
      key: "factor",
      type: "number"
    }
  ]

  @ViewChild('form') form: NgForm;
  @ViewChild('barcodeParent') barcodeParent: ElementRef;
  @ViewChild('itemGroupDropdown') itemGroupDropdown: DropdownListComponent;
  @ViewChild('itemTypeDropdown') itemTypeDropdown: DropdownListComponent;
  @ViewChild('storeDropdown') storeDropdown: DropdownListComponent;
  @ViewChild('storeDropdown') storeSectionDropdown: DropdownListComponent;

  get isDropdownsInvalid() {
    return this.itemGroupDropdown.invalid ||
            this.itemTypeDropdown.invalid ||
            this.storeDropdown.invalid ||
            this.storeSectionDropdown.invalid;
  } 
  resetDropdowns() {
    this.itemGroupDropdown.reset();
    this.itemTypeDropdown.reset();
    this.storeDropdown.reset();
    this.storeSectionDropdown.reset();
  }

  constructor(
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private notifier: NotifierService,
    private objectsOperator: ObjectsOperationsService,
    private swalService: SwalService,
    private itemsService: ItemsService,
    private itemGroupsService: ItemGroupsService,
    private itemTypesService: ItemTypesService,
    private storesService: StoresService,
    private storeSectionsService: StoreSectionsService,
    private unitsService: UnitsService,
    private dateService: DateService,
    private permissionsService: PermissionsService
  ) { }

  ngOnInit() {
    this.permission = this.permissionsService.getPermission(PERMISSIONS.items);
    this.getDropDowns();

    this.item = new Item();
    this.route.params.subscribe(
      params => {
        if (params.groupId, params.id, params.year) {
          this.getById(params.groupId, params.id, params.year)
        } else {
          this.reset();
        }
      }
    )
  }

  save() {
    if (!this.isValidItemsUnits())
      return;
    this.busySaving = true;
    if (this.isEdit) {
      this.update()
    } else {
      this.create()
    }
  }
  cancel() {
    if (this.isEdit) {
      this.item = Object.assign({}, this.itemPackup)
      this.item.itemUnits = this.objectsOperator.copyArrayOfObjects(this.itemPackup.itemUnits);
    } else {
      this.reset();
    }
  }
  create() {
    this.item.itemYear = this.dateService.fromGregorianToUmmulqura(new Date())._year;
    this.item.barcodeImg = this.getBase64ImageFromBarCode();
    this.itemsService.create(this.item).subscribe(
      res => {
        this.reset();
        this.busySaving = false;
        this.notifier.notify('success', 'تمت الإضافة بنجاح');
      },
      err => {
        this.busySaving = false;
        let errorMessage = err.message || 'حدث خطأ اثناء الإضافة';
        this.notifier.notify('error', errorMessage);
      }
    )
  }
  update() {
    this.item.barcodeImg = this.getBase64ImageFromBarCode();
    this.itemsService.update(this.item.itemGroupId, this.item.itemId, this.item.itemYear, this.item).subscribe(
      res => {
        this.setItemFromResponse(res);
        this.busySaving = false;
        this.notifier.notify('success', 'تم التعديل  بنجاح');
      },
      err => {
        this.busySaving = false;
        const errorMessage = err.message || 'حدث خطأ اثناء التعديل';
        this.notifier.notify('error', errorMessage);
      }
    )
  }
  delete() {
    this.swalService.showRemoveConfirmation(this.item.itemName).then(
      result => {
        if (result.value) {
          this.itemsService.delete(this.item.itemGroupId, this.item.itemId, this.item.itemYear).subscribe(
            res => {
              this.notifier.notify('success', 'تم الحذف  بنجاح');
              this.reset();
            },
            err => {
              let errorMessage = err.message || 'حدث خطأ اثناء الحذف';
              this.notifier.notify('error', errorMessage);
            }
          )
        }
      }
    );
  }
  getById(groupId: string, id: string, year: string) {
    this.spinner.show();
    this.itemsService.get(groupId, id, year).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  reset() {
    this.form.reset();
    this.resetDropdowns();
    setTimeout(() => { this.item = new Item(); }, 50);
    this.isEdit = false;
    this.rank = null;
    this.totalCount = null;
  }
  getNewId() {
    this.itemsService.getNewId(this.item.itemGroupId).subscribe(
      res => {
        this.item.itemId = res.newItemId;
        this.calcItemGroupId();
      }
    )
  }
 
  getFirst() {
    this.spinner.show();
    this.itemsService.getFirstRow().subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  getLast() {
    this.spinner.show();
    this.itemsService.getLastRow().subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  getNext() {
    this.spinner.show();
    this.itemsService.getNextRow(this.rank, this.item.itemYear).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  getPrevious() {
    this.spinner.show();
    this.itemsService.getPreviousRow(this.rank, this.item.itemYear).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }

  setItemFromResponse(res: ResultWithRanking<Item>) {
    this.item = res.result;
    this.rank = res.rank;
    this.totalCount = res.totalCount;
    this.itemPackup = Object.assign({}, this.item)
    this.itemPackup.itemUnits = this.objectsOperator.copyArrayOfObjects(this.item.itemUnits);
    this.isEdit = true;
    this.spinner.hide();
  }
  getItemErrorHandler(err) {
    const errorMessage = err.message || 'غير موجود';
    this.notifier.notify('error', errorMessage);
    this.spinner.hide();
  }

  calcItemGroupId() {
    if (!this.item.itemGroupId || !this.item.itemId) return this.item.itemFullCode = null;
    this.item.itemFullCode = this.item.itemGroupId.toString() + this.item.itemId.toString();
  }

  getDropDowns(): void {
    this.dropdownsLoading = true;
    forkJoin([
      this.itemGroupsService.getAll(),
      this.itemTypesService.getAll(),
      this.storesService.getAll(),
      this.storeSectionsService.getAll(),
      this.unitsService.getAll()
    ]).subscribe(
      res => {
        this.itemGroups = res[0];
        this.itemTypes = res[1];
        this.stores = res[2].result;
        this.storeSections = res[3];
        this.itemGroupsTableConfig[0].select = {
          displayTextKey: "unitName",
          valueKey: "unitId",
          list: res[4]
        }
        this.dropdownsLoading = false;
      },
      err => {
        this.dropdownsLoading = false;
      }
    )
  }

  isValidItemsUnits() {
    let haveFactorOfOne = false;
    for (let i = 0; i < this.item.itemUnits.length; i++) {
      if (this.item.itemUnits[i].status === ObjectStatus.deleted)
        continue;
      if (this.item.itemUnits[i].factor == 1) {
        haveFactorOfOne = true;
      }
      for (let j = i + 1; j < this.item.itemUnits.length; j++) {
        if (this.item.itemUnits[i].unitId == this.item.itemUnits[j].unitId) {
          this.swalService.showError("خطأ", "لا يمكن تكرار الوحدة");
          return false;
        }
        if (this.item.itemUnits[i].factor == this.item.itemUnits[j].factor) {
          this.swalService.showError("خطأ", "لا يمكن تكرار المعامل");
          return false;
        }
      }
    }
    if (!haveFactorOfOne) {
      this.swalService.showError("خطأ", "يجب اختيار وحدة إفتراضية معاملها = 1");
      return false;
    }
    return true;
  }
  getBase64ImageFromBarCode(): string {
    const bareCodeSvg = this.barcodeParent.nativeElement.getElementsByClassName("barcode")[0].children[0]
    return window.btoa(bareCodeSvg.outerHTML);
  }
  print() {
    this.busyPrinting = true;
    this.itemsService.printReport(this.item.itemGroupId, this.item.itemId, this.item.itemYear).subscribe(
      (res: any) => {
        console.log("print res ", res)
        if (res.pdfUrl) {
          window.open(res.pdfUrl, "_blank", 'location=yes,height=600,width=900,scrollbars=yes,status=yes');
          this.busyPrinting = false;
        }
      },
      err => {
        console.log("print err ", err)
        let errorMessage = err.message || 'خطأ فى الحصول على ملف الطباعة';
        this.notifier.notify('error', errorMessage);
        this.busyPrinting = false;
      }
    )
  }

  selectItemGroup(itemGroup: ItemGroup) {
    this.item.itemGroupId = itemGroup.itemGroupId+'';
    this.getNewId();
  }
  selectItemType(itemType: ItemType) {
    this.item.itemTypeId = itemType.itemTypeId;
  }
  selectStore(store: Store) {
    this.item.storeId = store.storeId;
  }
  selectStoreSection(storeSection: StoreSection) {
    this.item.storeSectionId = storeSection.storeSectionId;
  }

}