import { Component, OnInit, ViewChild } from '@angular/core';

//import { Branch, Store, StoreKeeper, Config, Employee, Permission } from '../../../shared/models';
import { StoresService, BranchesService, EmployeesService, StoreKeepersService, PermissionsService, PERMISSIONS, SuppliersService, SwalService, StoresTrxesService, ObjectsOperationsService } from 'src/app/shared/services';
import { Branch, Store, StoreKeeper, Config, Employee, Permission, Supplier, StoreTrxe, ResultWithRanking } from 'src/app/shared/models';
import { forkJoin } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DropdownListComponent } from 'src/app/shared/components';
const TRX_TYPE_ID = 8;

@Component({
  selector: 'app-return-document-add-edit',
  templateUrl: './return-document-add-edit.component.html',
  styleUrls: ['./return-document-add-edit.component.css']
})
export class ReturnDocumentAddEditComponent implements OnInit {
  storeTrxes = new StoreTrxe({ trxTypeId: TRX_TYPE_ID });
  storeTrxePackup = new StoreTrxe({ trxTypeId: TRX_TYPE_ID });
  isEdit: boolean = false;
  branches: Branch[];
  stores: Store[];
  employees: Employee[];
  storeKeepers: StoreKeeper[];
  permission: Permission;
  dropdownsLoading: boolean = false;
  busySaving: boolean = false;
  rank: number;
  totalCount: number;
  trxTypeId: number;

  @ViewChild('form') form: NgForm;
  @ViewChild('storeDropdown') storeDropdown: DropdownListComponent;
  @ViewChild('storeManagerDropdown') storeManagerDropdown: DropdownListComponent;
  @ViewChild('deliveryPersonDropdown') deliveryPersonDropdown: DropdownListComponent;
  @ViewChild('ownerDropdown') ownerDropdown: DropdownListComponent;
  @ViewChild('storeKeeperDropdown') storeKeeperDropdown: DropdownListComponent;
  @ViewChild('branchDropdown') branchDropdown: DropdownListComponent;
  @ViewChild('branchManagerDropdown') branchManagerDropdown: DropdownListComponent;

  get isDropdownsInvalid() {
    return this.storeDropdown.invalid ||
            this.storeManagerDropdown.invalid ||
            this.deliveryPersonDropdown.invalid ||
            this.ownerDropdown.invalid ||
            this.storeKeeperDropdown.invalid ||
            this.branchDropdown.invalid ||
            this.branchManagerDropdown.invalid;
  } 
  resetDropdowns() {
    this.storeDropdown.reset();
    this.storeManagerDropdown.reset();
    this.deliveryPersonDropdown.reset();
    this.ownerDropdown.reset();
    this.storeKeeperDropdown.reset();
    this.branchDropdown.reset();
    this.branchManagerDropdown.reset();
  }
  
  constructor(
    private storesService: StoresService,
    private branchService: BranchesService,
    private employeeService: EmployeesService,
    private storeKeeperService: StoreKeepersService,
    private storeTrxeService: StoresTrxesService,
    private permissionsService: PermissionsService,
    private notifier: NotifierService,
    private spinner: NgxSpinnerService,
    private swalService: SwalService,
    private route: ActivatedRoute,
    private objectsOperator: ObjectsOperationsService,

  ) { }

  ngOnInit() {
    this.listAllDropDowns();
    if (this.route.snapshot.params.trxSerial) {
      this.getById(this.route.snapshot.params.trxSerial);
    }
    else {
      this.reset()
    }
    this.permission = this.permissionsService.getPermission(PERMISSIONS.returnDocument);
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

  save() {
    this.busySaving = true;
    if (this.isEdit) {
      this.update()
    } else {
      this.create()
    }
  }
  cancel() {
    if (this.isEdit) {
      this.storeTrxes = Object.assign({}, this.storeTrxePackup);
      this.storeTrxes.storeTrxMembers=this.objectsOperator.copyArrayOfObjects(this.storeTrxePackup.storeTrxMembers);
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
  update() {
    this.storeTrxeService.update(this.storeTrxes.trxSerial, this.storeTrxes, TRX_TYPE_ID).subscribe(
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
        if (result.value) {
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
  getById(id: number) {
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
    this.storeTrxePackup = Object.assign({}, this.storeTrxes)
    this.storeTrxePackup.storeTrxMembers=this.objectsOperator.copyArrayOfObjects(this.storeTrxes.storeTrxMembers);

    this.isEdit = true;
    this.spinner.hide();
  }
  getItemErrorHandler(err) {
    let errorMessage = err.message || 'غير موجود';
    this.notifier.notify('error', errorMessage);
    this.spinner.hide();
  }
  selectDate(date) {
    this.storeTrxes.date = date.greg
    this.storeTrxes.dateH = date.hijri
  }

  selectStore(store: Store) {
    this.storeTrxes.storeId = store.storeId;
  }
  selectStoreManager(employee: Employee) {
    this.storeTrxes.storeManagerId = employee.empId;
  }
  selectDeliveryPerson(employee: Employee) {
    this.storeTrxes.deliveryPersonId = employee.empId;
  }
  selectOwner(employee: Employee) {
    this.storeTrxes.ownerId = employee.empId;
  }
  selectStoreKeeper(storeKeeper: StoreKeeper) {
    this.storeTrxes.storeKeeperId = storeKeeper.storeKeeperId;
  }
  selectBranch(branch: Branch) {
    this.storeTrxes.branchId = branch.branchId;
  }
  selectBranchManager(employee: Employee) {
    this.storeTrxes.branchManagerId = employee.empId;
  }

}


