import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';
import {  Store, StoreKeeper, Employee, StoreTrxe, Permission, ResultWithRanking, Branch } from '../../../shared/models';
import {  StoreKeepersService, StoresService, EmployeesService, StoresTrxesService, SwalService, PermissionsService, PERMISSIONS, BranchesService } from '../../../shared/services';
import { forkJoin } from 'rxjs';
import { NgForm } from '@angular/forms';
import { TrxTypeIds } from 'src/app/shared/enums';
import { DropdownListComponent, GregorianHijriCalendarComponent } from 'src/app/shared/components';

const TRX_TYPE_ID = TrxTypeIds.transferCustody;
@Component({
  selector: 'app-transfer-custody',
  templateUrl: './transfer-custody.component.html',
  styleUrls: ['./transfer-custody.component.css']
})
export class TransferCustodyComponent implements OnInit {

  stores:Store[];
  storeKeepers:StoreKeeper[];
  employees:Employee[];
  branches: Branch[];
  storeTrxes = new StoreTrxe({trxTypeId: TRX_TYPE_ID});
  storeTrxePackup = new StoreTrxe({trxTypeId: TRX_TYPE_ID});
  isEdit: boolean = false;
  busySaving: boolean = false;
  dropdownsLoading: boolean = false;
  rank: number;
  totalCount: number;
  trxTypeId: number;
  permission: Permission;

  @ViewChild('form') form: NgForm;
  @ViewChild('ownerDropdown') ownerDropdown: DropdownListComponent;
  @ViewChild('demandBranchDropdown') demandBranchDropdown: DropdownListComponent;
  @ViewChild('storeDropdown') storeDropdown: DropdownListComponent;
  @ViewChild('storeManagerDropdown') storeManagerDropdown: DropdownListComponent;
  @ViewChild('storeKeeperDropdown') storeKeeperDropdown: DropdownListComponent;
  @ViewChild('recipientDropdown') recipientDropdown: DropdownListComponent;
  @ViewChild('datepicker') datepicker: GregorianHijriCalendarComponent;

  get isDropdownsInvalid() {
    return this.ownerDropdown.invalid ||
            this.demandBranchDropdown.invalid ||
            this.storeManagerDropdown.invalid ||
            this.storeDropdown.invalid ||
            this.storeKeeperDropdown.invalid ||
            this.recipientDropdown.invalid || 
            this.datepicker.invalid;
  } 
  resetDropdowns() {
    this.ownerDropdown.reset();
    this.demandBranchDropdown.reset();
    this.storeManagerDropdown.reset();
    this.storeDropdown.reset();
    this.storeKeeperDropdown.reset();
    this.recipientDropdown.reset();
    this.datepicker.reset();
  }

  constructor(
    private swalService: SwalService,
    private storesService:StoresService,
    private storeKeeperService:StoreKeepersService,
    private employeeService:EmployeesService,
    private branchesService: BranchesService,
    private storeTrxeService: StoresTrxesService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private notifier: NotifierService,
    private permissionsService: PermissionsService
  ) { }

  ngOnInit() {
    this.permission = this.permissionsService.getPermission(PERMISSIONS.transferCustody);
    this.getAllDropDowns();
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

  getAllDropDowns() {
    this.dropdownsLoading = true;
    forkJoin([
      this.storesService.getAll(),
      this.storeKeeperService.getAll(),
      this.employeeService.getAll(),
      this.branchesService.getAll()
    ]).subscribe(
      res => {
        this.stores = res[0].result;
        this.storeKeepers = res[1];
        this.employees = res[2];
        this.branches = res[3];
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
  reset() {
    this.form.reset();
    this.resetDropdowns();
    setTimeout(()=>{
      this.storeTrxes = new StoreTrxe({trxTypeId: TRX_TYPE_ID});
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
  selectOwner(employee: Employee) {
    this.storeTrxes.ownerId = employee.empId;
  }
  selectDemandBranch(branch: Branch) {
    this.storeTrxes.branchId = branch.branchId;
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
  selectRecipient(employee: Employee) {
    this.storeTrxes.recipientId = employee.empId+'';
  }

}

 