import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';

import { forkJoin } from 'rxjs';

import { Order, Branch, Store, Supplier, Employee, ResultWithRanking, Permission, ResultWithPagination, FilterParams } from 'src/app/shared/models';
import { BranchesService, SuppliersService, StoresService, EmployeesService, SwalService, PermissionsService, PERMISSIONS } from '../../../../shared/services';
import { OrdersService } from 'src/app/shared/services/api/orders.service';
import { TrxTypeIds } from 'src/app/shared/enums';
import { DropdownListComponent, GregorianHijriCalendarComponent } from 'src/app/shared/components';

@Component({
  selector: 'app-receive-record-add-edit',
  templateUrl: './receive-record-add-edit.component.html'
})
export class ReceiveRecordAddEditComponent implements OnInit {

  order: Order;
  orderPackup: Order;
  branches: Branch[];
  stores: Store[];
  selectedSupplier: Supplier;
  suppliers: ResultWithPagination<Supplier[]>;
  employees: Employee[];
  
  dropdownsLoading: boolean = false;
  isEdit: boolean = false;
  busySaving: boolean = false;
  rank: number;
  totalCount: number;
  permission: Permission;
  
  @ViewChild('form') form: NgForm;
  @ViewChild('storeDropdown') storeDropdown: DropdownListComponent;
  @ViewChild('supplierDropdown') supplierDropdown: DropdownListComponent;
  @ViewChild('branchDropdown') branchDropdown: DropdownListComponent;
  @ViewChild('managerDropdown') managerDropdown: DropdownListComponent;
  @ViewChild('techMemberDropdown') techMemberDropdown: DropdownListComponent;
  @ViewChild('recipientDropdown') recipientDropdown: DropdownListComponent;
  @ViewChild('datepicker') datepicker: GregorianHijriCalendarComponent;

  get isDropdownsInvalid() {
    return this.storeDropdown.invalid ||
            this.supplierDropdown.invalid ||
            this.branchDropdown.invalid ||
            this.managerDropdown.invalid ||
            this.techMemberDropdown.invalid ||
            this.recipientDropdown.invalid || 
            this.datepicker.invalid;
  } 
  resetDropdowns() {
    this.storeDropdown.reset();
    this.supplierDropdown.reset();
    this.branchDropdown.reset();
    this.managerDropdown.reset();
    this.techMemberDropdown.reset();
    this.recipientDropdown.reset();
    this.datepicker.reset();
  }

  constructor(
    private route: ActivatedRoute,
    private branchService: BranchesService,
    private supplierService: SuppliersService,
    private storesService: StoresService,
    private employeeService: EmployeesService,
    private ordersService: OrdersService,
    private spinner: NgxSpinnerService,
    private swalService: SwalService,
    private notifier: NotifierService,
    private permissionsService: PermissionsService
  ) { }

  ngOnInit() {
    this.permission = this.permissionsService.getPermission(PERMISSIONS.receiveRecord);
    this.order = new Order({trxTypeId: TrxTypeIds.recieveRecord})
    this.getAllDropDowns();
    if(this.route.snapshot.params.orderSerial) {
      console.log(this.route.snapshot.params.orderSerial);
      this.getById(this.route.snapshot.params.orderSerial);
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
      this.employeeService.getAll()
    ]).subscribe(
      res => {
        this.branches = res[0];
        this.stores = res[1].result;
        this.employees = res[2];
        this.dropdownsLoading = false;
      },
      err => {
        this.dropdownsLoading = false;
      }
    );
  }
  getSelectedSupplier() {
    this.selectedSupplier = undefined;
    if(!this.order.supplierId)
      return;
    this.supplierService.get(this.order.supplierId).subscribe(
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
      this.order =  Object.assign({}, this.orderPackup);
      this.getSelectedSupplier();
    } else {
      this.reset();
    }
  }
  create() {
    this.ordersService.create(this.order).subscribe(
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
    this.ordersService.update(this.order.orderSerial, this.order, TrxTypeIds.recieveRecord).subscribe(
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
 this.swalService.showRemoveConfirmation(this.order.orderSerial).then(
      result => {
        if(result.value) {
          this.ordersService.delete(this.order.orderSerial, TrxTypeIds.recieveRecord).subscribe(
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
  getById(id:number) {
    this.spinner.show;
    this.ordersService.get(id, TrxTypeIds.recieveRecord).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  getNext() {
    this.spinner.show();
    this.ordersService.getNextRow(this.rank, TrxTypeIds.recieveRecord).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  getPrevious() {
    this.spinner.show();
    this.ordersService.getPreviousRow(this.rank, TrxTypeIds.recieveRecord).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  getFirst() {
    this.spinner.show();
    this.ordersService.getFirstRow(TrxTypeIds.recieveRecord).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  getLast() {
    this.spinner.show();
    this.ordersService.getLastRow(TrxTypeIds.recieveRecord).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  setItemFromResponse(res: ResultWithRanking<Order>) {
    this.order = res.result;
    this.getSelectedSupplier();
    this.rank = res.rank;
    this.totalCount = res.totalCount;
    this.orderPackup =  Object.assign({}, this.order);
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
    this.selectedSupplier = undefined;
    setTimeout(() => {
      this.order = new Order({ trxTypeId: TrxTypeIds.recieveRecord });
      this.getNewId();
    }, 50);
    this.isEdit = false;
    this.rank = null;
    this.totalCount = null;
  }
  getNewId() {
    this.ordersService.getNewId(TrxTypeIds.recieveRecord).subscribe(
      res => {
        this.order.orderSerial = res;
      }
    )
  }
  selectDate(date) {
    this.order.date = date.greg
    this.order.dateH = date.hijri
  }
  selectDocDate(date) {
    this.order.docDate = date.greg
    this.order.docDateH = date.hijri
  }

  selectStore(store: Store) {
    this.order.storeId = store.storeId;
  }
  selectRecipient(employee: Employee) {
    this.order.recipientId = employee.empId;
  }
  selectSupplier(supplier: Supplier) {
    this.order.supplierId = supplier.supplierId;
  }
  selectBranch(branch: Branch) {
    this.order.branchId = branch.branchId;
  }
  selectManager(employee: Employee) {
    this.order.managerId = employee.empId;
  }
  selectTechMember(employee: Employee) {
    this.order.techMemberId = employee.empId;
  }
}
