import { Component, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { NgForm } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';

import { Branch, Store, Supplier, StoreKeeper, Employee, StoreTrxe, ResultWithRanking, Permission, ResultWithPagination, FilterParams } from '../../../shared/models';
import {
  BranchesService,
  StoreKeepersService,
  SuppliersService,
  StoresService,
  EmployeesService,
  StoresTrxesService,
  SwalService,
  PermissionsService,
  PERMISSIONS
} from '../../../shared/services';
import { ActivatedRoute } from '@angular/router';
import { DropdownListComponent, GregorianHijriCalendarComponent } from 'src/app/shared/components';


const TRX_TYPE_ID = 4;

@Component({
  selector: 'app-receive-note-add-edit',
  templateUrl: './receive-note-add-edit.component.html',
  styleUrls: ['./receive-note-add-edit.component.css']
})
export class ReceiveNoteAddEditComponent implements OnInit {
  storeTrxes = new StoreTrxe({ trxTypeId: TRX_TYPE_ID });
  storeTrxePackup = new StoreTrxe({trxTypeId: TRX_TYPE_ID});
  isEdit: boolean = false;
  branches: Branch[];
  stores: Store[];
  selectedSupplier: Supplier;
  suppliers: ResultWithPagination<Supplier[]>;
  storeKeepers: StoreKeeper[];
  employees: Employee[];
  dropdownsLoading: boolean = false;
  busySaving: boolean = false;
  rank: number;
  totalCount: number;
  trxTypeId: number;
  permission: Permission;

  @ViewChild('form') form: NgForm;
  @ViewChild('branchDropdown') branchDropdown: DropdownListComponent;
  @ViewChild('storeDropdown') storeDropdown: DropdownListComponent;
  @ViewChild('supplierDropdown') supplierDropdown: DropdownListComponent;
  @ViewChild('storeKeeperDropdown') storeKeeperDropdown: DropdownListComponent;
  @ViewChild('branchManagerDropdown') branchManagerDropdown: DropdownListComponent;
  @ViewChild('recipientDropdown') recipientDropdown: DropdownListComponent;
  @ViewChild('datepicker') datepicker: GregorianHijriCalendarComponent;

  get isDropdownsInvalid() {
    return this.branchDropdown.invalid ||
            this.storeDropdown.invalid ||
            this.supplierDropdown.invalid ||
            this.storeKeeperDropdown.invalid ||
            this.branchManagerDropdown.invalid ||
            this.recipientDropdown.invalid || 
            this.datepicker.invalid;
  } 
  
  resetDropdowns() {
    this.branchDropdown.reset();
    this.storeDropdown.reset();
    this.supplierDropdown.reset();
    this.storeKeeperDropdown.reset();
    this.branchManagerDropdown.reset();
    this.recipientDropdown.reset();
    this.datepicker.reset();
  }
  
  constructor(
    private storesService: StoresService,
    private supplierService: SuppliersService,
    private storeKeeperService: StoreKeepersService,
    private branchService: BranchesService,
    private employeeService: EmployeesService,
    private storeTrxeService: StoresTrxesService,
    private notifier: NotifierService,
    private spinner: NgxSpinnerService,
    private swalService: SwalService,
    private route: ActivatedRoute,
    private permissionsService: PermissionsService

  ) { }

  ngOnInit() {
    this.permission = this.permissionsService.getPermission(PERMISSIONS.receiveNote);
    this.listAllDropDowns();
    if(this.route.snapshot.params.trxSerial) {
      this.getById(this.route.snapshot.params.trxSerial);
    }
    else{
      this.reset()
    }
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
      this.storeTrxePackup.total = this.storeTrxes.total;
      this.getSelectedSupplier()
      this.storeTrxePackup.net = this.storeTrxes.net;
      this.storeTrxes =  Object.assign({}, this.storeTrxePackup);
      this.calcNet();
    } else {
      this.reset();
    }
  }
  create() {
    this.storeTrxeService.create(this.storeTrxes).subscribe(
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
    this.storeTrxeService.update(this.storeTrxes.trxSerial,this.storeTrxes, TRX_TYPE_ID).subscribe(
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
    this.swalService.showRemoveConfirmation(this.storeTrxes.trxSerial).then(
      result => {
        if(result.value) {
          this.storeTrxeService.delete(this.storeTrxes.trxSerial, TRX_TYPE_ID).subscribe(
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
    this.selectedSupplier = undefined;
    setTimeout(() => {
      this.storeTrxes = new StoreTrxe({ trxTypeId: TRX_TYPE_ID });
      this.getNewId();
    }, 50);
    this.isEdit = false;
    this.rank = null;
    this.totalCount = null;
  }
  getNewId() {
    this.storeTrxeService.getNewId(TRX_TYPE_ID).subscribe(
      res => {
        this.storeTrxes.trxSerial = res;
      }
    )
  }
  getById(id:number) {
    this.spinner.show();
    this.storeTrxeService.get(id, TRX_TYPE_ID).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }

  getNext() {
    this.spinner.show();
    this.storeTrxeService.getNextRow(this.rank, TRX_TYPE_ID).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  getPrevious() {
    this.spinner.show();
    this.storeTrxeService.getPreviousRow(this.rank, TRX_TYPE_ID).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  getFirst() {
    this.spinner.show();
    this.storeTrxeService.getFirstRow(TRX_TYPE_ID).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  getLast() {
    this.spinner.show();
    this.storeTrxeService.getLastRow(TRX_TYPE_ID).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  setItemFromResponse(res: ResultWithRanking<StoreTrxe>) {
    this.storeTrxes = res.result;
    this.getSelectedSupplier();
    this.rank = res.rank;
    this.totalCount = res.totalCount;
    this.storeTrxePackup =  Object.assign({}, this.storeTrxes)
    this.isEdit=true;
    this.spinner.hide();
  }
  getItemErrorHandler(err) {
    let errorMessage = err.message || 'غير موجود';
    this.notifier.notify('error', errorMessage);
    this.spinner.hide();
  }
  
  listAllDropDowns() {
    this.dropdownsLoading = true;
    forkJoin([
      this.employeeService.getAll(),
      this.branchService.getAll(),
      this.storeKeeperService.getAll(),
      this.storesService.getAll()
    ]).subscribe(
      res => {
        this.employees = res[0];
        this.branches = res[1];
        this.storeKeepers = res[2];
        this.stores = res[3].result;
        this.dropdownsLoading = false;

      }, err => {
        this.dropdownsLoading = false;

      }
    );
  }
  getSelectedSupplier() {
    this.selectedSupplier = undefined;
    if(!this.storeTrxes.supplierId)
      return;
    this.supplierService.get(this.storeTrxes.supplierId).subscribe(
      res => {
        this.selectedSupplier = res.result;
      }
    )
  }
  onChangeFilterSuppliers(params?: FilterParams) {
    this.supplierService.getAll(params).subscribe(
      res => {
        this.suppliers = res;
      }
    );
  }
  selectDate(date) {
    this.storeTrxes.date = date.greg
    this.storeTrxes.dateH = date.hijri
  }
  selectPurchaseOrderDate(date) {
    this.storeTrxes.purchaseOrderDate = date.greg
    this.storeTrxes.purchaseOrderDateH = date.hijri
  }
  selectShippingDate(date) {
    this.storeTrxes.shippingDate = date.greg
    this.storeTrxes.shippingDateH = date.hijri
  }
  selectCheckDate(date) {
    this.storeTrxes.checkDate = date.greg
    this.storeTrxes.checkDateH = date.hijri
  }
  selectReceiveDate(date){
    this.storeTrxes.tempReceiveDate = date.greg
    this.storeTrxes.tempReceiveDateH = date.hijri
  }
  changeTotal(total) {
    this.storeTrxes.total = total;
    this.calcNet();
  }
  calcNet() {
    this.storeTrxes.discountValue = this.storeTrxes.discountValue || 0;
    this.storeTrxes.totalVat = this.storeTrxes.totalVat || 0;
    const afterDiscount = this.storeTrxes.total - this.storeTrxes.discountValue;
    this.storeTrxes.net = afterDiscount + ( (this.storeTrxes.totalVat / 100) * afterDiscount); 
  }

  selectBranch(branch: Branch) {
    this.storeTrxes.branchId = branch.branchId;
  }
  selectStore(store: Store) {
    this.storeTrxes.storeId = store.storeId;
  }
  selectSupplier(supplier: Supplier) {
    this.storeTrxes.supplierId = supplier.supplierId;
  }
  selectStoreKeeper(storeKeeper: StoreKeeper) {
    this.storeTrxes.storeKeeperId = storeKeeper.storeKeeperId;
  }
  selectBranchManager(employee: Employee) {
    this.storeTrxes.branchManagerId = employee.branchId;
  }
  selectRecipient(employee: Employee) {
    this.storeTrxes.recipientId = employee.empId+'';
  }
}

