import { Component, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { NgForm } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';

import { Branch, Store, StoreKeeper, Employee, StoreTrxe, ResultWithRanking, Permission } from '../../../shared/models';
import { 
  BranchesService,
   StoreKeepersService,
   StoresService,
   EmployeesService,
   SwalService, 
   StoresTrxesService,
   PermissionsService,
   PERMISSIONS
  } from '../../../shared/services';
import { DropdownListComponent, GregorianHijriCalendarComponent } from 'src/app/shared/components';

const TRX_TYPE_ID = 106;
@Component({
  selector: 'app-item-out-order-add-edit',
  templateUrl: './item-out-order-add-edit.component.html',
  styleUrls: ['./item-out-order-add-edit.component.css']
})
export class ItemOutOrderAddEditComponent implements OnInit {
  storeTrxes = new StoreTrxe({ trxTypeId: TRX_TYPE_ID });
  storeTrxePackup = new StoreTrxe({ trxTypeId: TRX_TYPE_ID });
  branches: Branch[];
  stores: Store[];
  storeKeepers: StoreKeeper[];
  employees: Employee[];
  dropdownsLoading: boolean = false;
  isEdit: boolean = false;
  busySaving: boolean = false;
  rank: number;
  totalCount: number;
  trxTypeId: number; 
  permission: Permission;
  @ViewChild('form') form: NgForm;
  @ViewChild('owner') owner: DropdownListComponent;
  @ViewChild('demandBranch') demandBranch: DropdownListComponent;
  @ViewChild('branchManager') branchManager: DropdownListComponent;
  @ViewChild('store') store: DropdownListComponent;
  @ViewChild('storeManager') storeManager: DropdownListComponent;
  @ViewChild('storeKeeper') storeKeeper: DropdownListComponent;
  @ViewChild('branch') branch: DropdownListComponent;
  @ViewChild('deliveryPerson') deliveryPerson: DropdownListComponent;
  @ViewChild('datepicker') datepicker: GregorianHijriCalendarComponent;
  
  get isDropdownsInvalid() {
    return this.owner.invalid ||
            this.demandBranch.invalid ||
            this.demandBranch.invalid ||
            this.branchManager.invalid ||
            this.store.invalid ||
            this.storeManager.invalid ||
            this.storeKeeper.invalid ||
            this.branch.invalid ||
            this.deliveryPerson.invalid ||
            this.datepicker.invalid;
  }
  resetDropdowns() {
    this.owner.reset();
    this.demandBranch.reset();
    this.demandBranch.reset();
    this.branchManager.reset();
    this.store.reset();
    this.storeManager.reset();
    this.storeKeeper.reset();
    this.branch.reset();
    this.deliveryPerson.reset();
    this.datepicker.reset();
  }

  constructor(
    private storesService: StoresService,
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
    this.permission = this.permissionsService.getPermission(PERMISSIONS.itemOutOrder);
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
      this.storesService.getAll(),
      this.storeKeeperService.getAll(),
      this.branchService.getAll(),
      this.employeeService.getAll()
    ]).subscribe(
      res => {
        this.stores = res[0].result;
        this.storeKeepers = res[1];
        this.branches = res[2];
        this.employees = res[3];
        this.dropdownsLoading = false;
      },
      err => {
        this.dropdownsLoading = false;

      }
    );
  }

  selectDate(date) {
    this.storeTrxes.date = date.greg
    this.storeTrxes.dateH = date.hijri
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
      this.storeTrxes =  Object.assign({}, this.storeTrxePackup)
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

  selectOwner(employee: Employee) {
    this.storeTrxes.ownerId = employee.empId;
  }
  selectDemandBranch(branch: Branch) {
    this.storeTrxes.demandBranchId = branch.branchId;
  }
  selectBranchManager(employee: Employee) {
    this.storeTrxes.branchManagerId = employee.empId;
  }
  selectStore(store: Store) {
    this.storeTrxes.storeId = store.storeId;
  }
  selectStoreManager(employee: Employee) {
    this.storeTrxes.storeManagerId = employee.empId;
  }
  selectStoreKeeper(storeKeeper: StoreKeeper) {
    this.storeTrxes.storeKeeperId = storeKeeper.storeKeeperId;
  }
  selectBranch(branch: Branch) {
    this.storeTrxes.branchId = branch.branchId;
  }
  selectDeliveryPerson(employee: Employee) {
    this.storeTrxes.deliveryPersonId = employee.empId;
  }
}

