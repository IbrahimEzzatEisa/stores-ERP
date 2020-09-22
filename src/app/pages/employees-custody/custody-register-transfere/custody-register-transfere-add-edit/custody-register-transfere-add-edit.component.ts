import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';

import { CustodyTypes } from 'src/app/shared/enums';
import { Permission, CustodyTrx, Employee, ResultWithRanking } from 'src/app/shared/models';
import { SwalService, PermissionsService, PERMISSIONS, CustodyTrxesService, EmployeesService } from 'src/app/shared/services';
import { DropdownListComponent, GregorianHijriCalendarComponent } from 'src/app/shared/components';

const CUSTODY_REGISTER_PAGE_PATH = "custody-register";
const CUSTODY_TRANSFERE_PAGE_PATH = "custody-transfer";

@Component({
  selector: 'app-custody-register-transfere-add-edit',
  templateUrl: './custody-register-transfere-add-edit.component.html'
})
export class CustodyRegisterTransfereAddEditComponent implements OnInit {

  custodyTypes = CustodyTypes;
  custodyTrx: CustodyTrx;
  custodyTrxPackup: CustodyTrx;
  employees: Employee[];
  dropdownsLoading: boolean = false;
  isEdit: boolean = false;
  busySaving: boolean = false;
  rank: number;
  totalCount: number;
  menuUrl: string;
  pageCustodyType: number;
  pageTitle: string;

  permission: Permission;

  @ViewChild('form') form: NgForm;
  @ViewChild('ownerDropdown') ownerDropdown: DropdownListComponent;
  @ViewChild('empDropdown') empDropdown: DropdownListComponent;
  @ViewChild('toEmpDropdown') toEmpDropdown: DropdownListComponent;
  @ViewChild('branchManagerDropdown') branchManagerDropdown: DropdownListComponent;
  @ViewChild('datepicker') datepicker: GregorianHijriCalendarComponent;

  get isDropdownsInvalid() {
    return this.ownerDropdown.invalid ||
            this.empDropdown.invalid ||
            (this.toEmpDropdown && this.toEmpDropdown.invalid) ||
            this.branchManagerDropdown.invalid ||
            this.datepicker.invalid;
  } 
  resetDropdowns() {
    this.ownerDropdown.reset();
    this.empDropdown.reset();
    this.toEmpDropdown ? this.toEmpDropdown.reset(): null;
    this.branchManagerDropdown.reset();
    this.datepicker.reset();
  }
  constructor(
    private route: ActivatedRoute,
    private notifier: NotifierService,
    private spinner: NgxSpinnerService,
    private custodyTrxesService: CustodyTrxesService,
    private employeeService: EmployeesService,
    private swalService: SwalService,
    private permissionsService: PermissionsService
  ) { }
  ngOnInit() {

    if(this.route.snapshot.url[0].path === CUSTODY_REGISTER_PAGE_PATH) {
      this.pageCustodyType = this.custodyTypes.register;
      this.pageTitle = "تسجيل عهدة";
      this.permission = this.permissionsService.getPermission(PERMISSIONS.custodyTrx);
      this.menuUrl = '/pages/employees-custody/custody-register/list';
    } else if(this.route.snapshot.url[0].path === CUSTODY_TRANSFERE_PAGE_PATH) {
      this.pageCustodyType = this.custodyTypes.transfere;
      this.pageTitle = "نقل عهدة";
      this.permission = this.permissionsService.getPermission(PERMISSIONS.custodyTransfer);
      this.menuUrl = '/pages/employees-custody/custody-transfer/list';
    }
    
    this.custodyTrx = new CustodyTrx();
    this.getAllDropDowns();
    if(this.route.snapshot.params.serial) {
      this.getById(this.route.snapshot.params.serial);
    }
    else{
      this.reset()
    }
  }

  getAllDropDowns() {
    this.dropdownsLoading = true;
      this.employeeService.getAll().subscribe(
        res => {
          this.employees = res;
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
      this.custodyTrx =  Object.assign({}, this.custodyTrxPackup);
    } else {
      this.reset();
    }
  }
  create() {
    if(this.route.snapshot.url[0].path === CUSTODY_REGISTER_PAGE_PATH) {
      this.custodyTrx.type = this.custodyTypes.register;
    } else if(this.route.snapshot.url[0].path === CUSTODY_TRANSFERE_PAGE_PATH) {
      this.custodyTrx.type = this.custodyTypes.transfere;
    }
    this.custodyTrxesService.create(this.custodyTrx).subscribe(
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
    this.custodyTrxesService.update(this.pageCustodyType, this.custodyTrx.serial, this.custodyTrx).subscribe(
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
    this.swalService.showRemoveConfirmation(this.custodyTrx.serial).then(
      result => {
        if(result.value) {
          this.custodyTrxesService.delete(this.pageCustodyType, this.custodyTrx.serial).subscribe(
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
      this.custodyTrx = new CustodyTrx();
      this.getNewId();
    }, 50);
    this.isEdit = false;
    this.rank = null;
    this.totalCount = null;
  }
  getNewId() {
    this.custodyTrxesService.getNewId(this.pageCustodyType).subscribe(
      res => {
        this.custodyTrx.serial = res;
      }
    )
  }
  getById(id:number) {
    this.spinner.show();
    this.custodyTrxesService.get(this.pageCustodyType, id).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }

  getNext() {
    this.spinner.show();
    this.custodyTrxesService.getNextRow(this.pageCustodyType, this.rank).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  getPrevious() {
    this.spinner.show();
    this.custodyTrxesService.getPreviousRow(this.pageCustodyType, this.rank).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  getFirst() {
    this.spinner.show();
    this.custodyTrxesService.getFirstRow(this.pageCustodyType).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  getLast() {
    this.spinner.show();
    this.custodyTrxesService.getLastRow(this.pageCustodyType).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  setItemFromResponse(res: ResultWithRanking<CustodyTrx>) {
    this.custodyTrx = res.result;
    this.rank = res.rank;
    this.totalCount = res.totalCount;
    this.custodyTrxPackup =  Object.assign({}, this.custodyTrx);
    this.isEdit=true;
    this.spinner.hide();
  }
  getItemErrorHandler(err) {
    let errorMessage = err.message || 'غير موجود';
    this.notifier.notify('error', errorMessage);
    this.spinner.hide();
  }

  selectOwner(employee: Employee) {
    this.custodyTrx.ownerId = employee.empId;
  }
  selectEmp(employee: Employee) {
    this.custodyTrx.empId = employee.empId;
  }
  selectToEmp(employee: Employee) {
    this.custodyTrx.toEmpId = employee.empId;
  }
  selectBranchManager(employee: Employee) {
    this.custodyTrx.branchManagerId = employee.empId;
  }
  selectDate(date) {
    this.custodyTrx.date = date.greg;
    this.custodyTrx.dateH = date.hijri;
  }

}
