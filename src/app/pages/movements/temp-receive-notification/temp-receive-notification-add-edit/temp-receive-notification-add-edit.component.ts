import { Component, OnInit, ViewChild } from '@angular/core';

import { StoresService, SuppliersService, StoreKeepersService, PermissionsService, PERMISSIONS, SwalService, ObjectsOperationsService, EmployeesService } from 'src/app/shared/services';
import { Store, Supplier, StoreKeeper, Config, Permission, Order, ResultWithRanking, Employee, FilterParams, ResultWithPagination } from '../../../../shared/models';
import { forkJoin, Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from 'src/app/shared/services/api/orders.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';
import { DropdownListComponent, GregorianHijriCalendarComponent } from 'src/app/shared/components';
const TRX_TYPE_ID = 3;

@Component({
  selector: 'app-temp-receive-notification-add-edit',
  templateUrl: './temp-receive-notification-add-edit.component.html',
  styleUrls: ['./temp-receive-notification-add-edit.component.css']
})
export class TempReceiveNotificationAddEditComponent implements OnInit {
  order = new Order({ trxTypeId: TRX_TYPE_ID });
  orderPackup = new Order({ trxTypeId: TRX_TYPE_ID });
  stores: Store[];
  selectedSupplier: Supplier;
  suppliers: ResultWithPagination<Supplier[]>;
  storeKeepers: StoreKeeper[];
  employees: Employee[];
  dropdownsLoading: boolean = false;
  busySaving: boolean = false;
  permission: Permission;
  isEdit: boolean = false;
  rank: number;
  totalCount: number;

  @ViewChild('form') form: NgForm;
  @ViewChild('storeDropdown') storeDropdown: DropdownListComponent;
  @ViewChild('supplierDropdown') supplierDropdown: DropdownListComponent;
  @ViewChild('storeKeeperDropdown') storeKeeperDropdown: DropdownListComponent;
  @ViewChild('storeManagerDropdown') storeManagerDropdown: DropdownListComponent;
  @ViewChild('recipientDropdown') recipientDropdown: DropdownListComponent;
  @ViewChild('datepicker') datepicker: GregorianHijriCalendarComponent;

  get isDropdownsInvalid() {
    return this.storeDropdown.invalid ||
            this.supplierDropdown.invalid ||
            this.storeKeeperDropdown.invalid ||
            this.storeManagerDropdown.invalid ||
            this.recipientDropdown.invalid || 
            this.datepicker.invalid;
  } 
  resetDropdowns() {
    this.storeDropdown.reset();
    this.supplierDropdown.reset();
    this.storeKeeperDropdown.reset();
    this.storeManagerDropdown.reset();
    this.recipientDropdown.reset();
    this.datepicker.reset();
  }

  constructor(
    private route: ActivatedRoute,
    private storesService: StoresService,
    private supplierService: SuppliersService,
    private storeKeeperService: StoreKeepersService,
    private employeesService: EmployeesService,
    private permissionsService: PermissionsService,
    private ordersService: OrdersService,
    private spinner: NgxSpinnerService,
    private swalService: SwalService,
    private notifier: NotifierService,
    private objectsOperator: ObjectsOperationsService
  ) {}

  ngOnInit() {
    this.permission = this.permissionsService.getPermission(PERMISSIONS.receiveNote);
    this.listAllDropDowns();
    if (this.route.snapshot.params.orderSerial) {
      this.getById(this.route.snapshot.params.orderSerial);
    }
    else {
      this.reset()
    }
  }

  listAllDropDowns() {
    this.dropdownsLoading = true;
    forkJoin([
      this.storeKeeperService.getAll(),
      this.storesService.getAll(),
      this.employeesService.getAll()
    ]).subscribe(
      res => {
        this.storeKeepers = res[0];
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
    if (this.isEdit) {
      this.update()
    } else {
      this.create()
    }
  }


  cancel() {
    if (this.isEdit) {
      this.order = Object.assign({}, this.orderPackup)
      this.getSelectedSupplier();
      this.order.orderTrxMembers = this.objectsOperator.copyArrayOfObjects(this.orderPackup.orderTrxMembers);
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
    this.ordersService.update(this.order.orderSerial, this.order, TRX_TYPE_ID).subscribe(
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
        if (result.value) {
          this.ordersService.delete(this.order.orderSerial, TRX_TYPE_ID).subscribe(
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
  getById(id: number) {
    this.spinner.show;
    this.ordersService.get(id, TRX_TYPE_ID).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  getNext() {
    this.spinner.show();
    this.ordersService.getNextRow(this.rank, TRX_TYPE_ID).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  getPrevious() {
    this.spinner.show();
    this.ordersService.getPreviousRow(this.rank, TRX_TYPE_ID).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  getFirst() {
    this.spinner.show();
    this.ordersService.getFirstRow(TRX_TYPE_ID).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  getLast() {
    this.spinner.show();
    this.ordersService.getLastRow(TRX_TYPE_ID).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }

  setItemFromResponse(res: ResultWithRanking<Order>) {
    this.order = res.result;
    this.getSelectedSupplier();
    this.rank = res.rank;
    this.totalCount = res.totalCount;
    this.orderPackup = Object.assign({}, this.order);
    this.orderPackup.orderTrxMembers = this.objectsOperator.copyArrayOfObjects(this.order.orderTrxMembers);
    this.isEdit = true;
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
      this.order = new Order({ trxTypeId: TRX_TYPE_ID });
      this.getNewId();
    }, 50);
    this.isEdit = false;
    this.rank = null;
    this.totalCount = null;
  }
  getNewId() {
    this.ordersService.getNewId(TRX_TYPE_ID).subscribe(
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
  selectStoreKeeper(storeKeeper: StoreKeeper) {
    this.order.storeKeeperId = storeKeeper.storeKeeperId;
  }
  selectStoreManager(employee: Employee) {
    this.order.storeManagerId = employee.empId;
  }
}



