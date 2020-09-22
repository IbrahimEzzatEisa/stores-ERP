import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';

import { 
  StockTakingTrxe, 
  Branch, 
  Store, 
  StoreKeeper, 
  Employee, 
  StockTakingTypes, 
  ItemGroup, 
  ResultWithRanking,
  Permission
} from 'src/app/shared/models';
import { 
  StockTakingTrxesService, 
  BranchesService, 
  EmployeesService, 
  StoresService, 
  StoreKeepersService, 
  StockTakingTypesService, 
  ItemGroupsService, 
  SwalService, 
  ObjectsOperationsService,
  PermissionsService,
  PERMISSIONS
} from 'src/app/shared/services';
import { DropdownListComponent, GregorianHijriCalendarComponent } from 'src/app/shared/components';

@Component({
  selector: 'app-stock-taking-trxes-add-edit',
  templateUrl: './stock-taking-trxes-add-edit.component.html'
})
export class StockTakingTrxesAddEditComponent implements OnInit {

  stockTakingTrxe: StockTakingTrxe;
  stockTakingTrxePackup: StockTakingTrxe;
  branches: Branch[];
  stores: Store[];
  storeKeepers: StoreKeeper[];
  employees: Employee[];
  stockTakingTypes: StockTakingTypes[];
  itemsGroups: ItemGroup[];
  dropdownsLoading: boolean = false;
  isEdit: boolean = false;
  busySaving: boolean = false;
  rank: number;
  totalCount: number;
  trxTypeId: number;

  permission: Permission;

  @ViewChild('form') form: NgForm;
  @ViewChild('storeDropdown') storeDropdown: DropdownListComponent;
  @ViewChild('storeKeeperDropdown') storeKeeperDropdown: DropdownListComponent;
  @ViewChild('storeManagerDropdown') storeManagerDropdown: DropdownListComponent;
  @ViewChild('stockTakingTypeDropdown') stockTakingTypeDropdown: DropdownListComponent;
  @ViewChild('itemGroupDropdown') itemGroupDropdown: DropdownListComponent;
  @ViewChild('datepicker') datepicker: GregorianHijriCalendarComponent;
  @ViewChild('endDatepicker') endDatepicker: GregorianHijriCalendarComponent;

  get isDropdownsInvalid() {
    return this.storeDropdown.invalid ||
            this.storeKeeperDropdown.invalid ||
            this.storeManagerDropdown.invalid ||
            this.stockTakingTypeDropdown.invalid ||
            this.itemGroupDropdown.invalid ||
            this.datepicker.invalid ||
            this.endDatepicker.invalid;
  } 
  resetDropdowns() {
    this.storeDropdown.reset();
    this.storeKeeperDropdown.reset();
    this.storeManagerDropdown.reset();
    this.stockTakingTypeDropdown.reset();
    this.itemGroupDropdown.reset();
    this.datepicker.reset();
    this.endDatepicker.reset();
  }
  
  constructor(
    private route: ActivatedRoute,
    private stockTakingTrxesService: StockTakingTrxesService,
    private branchService: BranchesService,
    private storesService: StoresService,
    private storeKeepersService: StoreKeepersService,
    private employeeService: EmployeesService,
    private stockTakingTypesService: StockTakingTypesService,
    private itemGroupsService: ItemGroupsService,
    private notifier: NotifierService,
    private spinner: NgxSpinnerService,
    private swalService: SwalService,
    private objectsOperator: ObjectsOperationsService,
    private permissionsService: PermissionsService
  ) { }

  ngOnInit() {
    this.permission = this.permissionsService.getPermission(PERMISSIONS.stockTakingTrx);

    this.stockTakingTrxe = new StockTakingTrxe();
    this.getAllDropDowns();
    if(this.route.snapshot.params.trxSerial) {
      this.getById(this.route.snapshot.params.trxSerial);
    }
    else{
      this.reset()
    }
  }
  getAllDropDowns() {
    this.dropdownsLoading = true;
    forkJoin([
      this.branchService.getAll(),
      this.storesService.getAll(),
      this.storeKeepersService.getAll(),
      this.employeeService.getAll(),
      this.stockTakingTypesService.getAll(),
      this.itemGroupsService.getAll()
    ]).subscribe(
      res => {
        this.branches = res[0];
        this.stores = res[1].result;
        this.storeKeepers = res[2];
        this.employees = res[3];
        this.stockTakingTypes = res[4];
        this.itemsGroups = res[5];
        this.dropdownsLoading = false;
      },
      err => {
        this.dropdownsLoading = false;
      }
    );
  }

  save() {
    this.busySaving = true;
    if(this.isEdit) {
      this.update()
    } else {
      this.create()
    }
  }
  cancel() {
    if(this.isEdit) {
      this.stockTakingTrxe =  Object.assign({}, this.stockTakingTrxePackup);
      this.stockTakingTrxe.stockTakingTrxMembers = this.objectsOperator.copyArrayOfObjects(this.stockTakingTrxePackup.stockTakingTrxMembers);
    } else {
      this.reset();
    }
  }
  create() {
    this.stockTakingTrxesService.create(this.stockTakingTrxe).subscribe(
      res => {
        this.setItemFromResponse(res);
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
  update(){
    this.stockTakingTrxesService.update(this.stockTakingTrxe.serial, this.stockTakingTrxe).subscribe(
      res => {
        this.setItemFromResponse(res);
        this.busySaving = false;
        this.notifier.notify('success', 'تم التعديل بنجاح');
      },
      err => {
        this.busySaving = false;
        let errorMessage = err.message || 'حدث خطأ اثناء التعديل';
        this.notifier.notify('error', errorMessage);
      }
    )
  }
  delete() {
    this.swalService.showRemoveConfirmation(this.stockTakingTrxe.serial).then(
      result => {
        if(result.value) {
          this.stockTakingTrxesService.delete(this.stockTakingTrxe.serial).subscribe(
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
  reset() {
    this.form.reset();
    this.resetDropdowns();
    setTimeout(() => {
      this.stockTakingTrxe = new StockTakingTrxe();
      this.getNewId();
    }, 50);
    this.isEdit = false;
    this.rank = null;
    this.totalCount = null;
  }
  getNewId() {
    this.stockTakingTrxesService.getNewId().subscribe(
      res => {
        this.stockTakingTrxe.serial = res;
      }
    )
  }
  getById(id:number) {
    this.spinner.show();
    this.stockTakingTrxesService.get(id).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }

  getNext() {
    this.spinner.show();
    this.stockTakingTrxesService.getNextRow(this.rank).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  getPrevious() {
    this.spinner.show();
    this.stockTakingTrxesService.getPreviousRow(this.rank).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  getFirst() {
    this.spinner.show();
    this.stockTakingTrxesService.getFirstRow().subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  getLast() {
    this.spinner.show();
    this.stockTakingTrxesService.getLastRow().subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  setItemFromResponse(res: ResultWithRanking<StockTakingTrxe>) {
    this.stockTakingTrxe = res.result;
    this.rank = res.rank;
    this.totalCount = res.totalCount;
    this.stockTakingTrxePackup =  Object.assign({}, this.stockTakingTrxe);
    this.stockTakingTrxePackup.stockTakingTrxMembers = this.objectsOperator.copyArrayOfObjects(this.stockTakingTrxe.stockTakingTrxMembers);
    this.isEdit=true;
    this.spinner.hide();
  }
  getItemErrorHandler(err) {
    let errorMessage = err.message || 'غير موجود';
    this.notifier.notify('error', errorMessage);
    this.spinner.hide();
  }

  selectDate(date) {
    this.stockTakingTrxe.date = date.greg;
    this.stockTakingTrxe.dateH = date.hijri;
  }
  selectEndDate(date) {
    this.stockTakingTrxe.endDate = date.greg;
    this.stockTakingTrxe.endDateH = date.hijri;
  }

  selectStore(store: Store) {
    this.stockTakingTrxe.storeId = store.storeId;
  }
  selectStoreKeeper(storeKeeper: StoreKeeper) {
    this.stockTakingTrxe.storeKeeperId = storeKeeper.storeKeeperId;
  }
  selectStoreManager(employee: Employee) {
    this.stockTakingTrxe.storeManagerId = employee.empId;
  }
  selectStockTakingType(stockTakingType: StockTakingTypes) {
    this.stockTakingTrxe.stockTakingTypeId = stockTakingType.stockTakingTypeId;
  }
  selectItemGroup(itemGroup: ItemGroup) {
    this.stockTakingTrxe.itemGroupId = itemGroup.itemGroupId+'';
  }

}
