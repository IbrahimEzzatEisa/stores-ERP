import { Component, OnInit, ViewChild } from '@angular/core';
import { MngrOrder, Branch,Config, ResultWithRanking, Permission } from 'src/app/shared/models';
import { BranchesService, SwalService, MngrOrdersService, PermissionsService, PERMISSIONS } from 'src/app/shared/services';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DropdownListComponent, GregorianHijriCalendarComponent } from 'src/app/shared/components';

@Component({
  selector: 'app-mngr-orders-add-edit',
  templateUrl: './mngr-orders-add-edit.component.html'
})
export class MngrOrdersAddEditComponent implements OnInit {
  MangrOrder=new MngrOrder();
  MangrOrderPackup=new MngrOrder();
  dropdownsLoading: boolean = false;
  isEdit: boolean = false;
  busySaving: boolean = false;
  rank: number;
  totalCount: number;
  branches:Branch[];
  permission: Permission;
  config:Config[]=[
    {
      label:"الرقم",
      key:"serial"
    },
    {
      label:"كودالمجموعة",
      key:"itemGroupId"
    },
     {
      label:"كود الصنف",
      key:"itemId"
    },
    {
      label:"اسم الصنف",
      key:"itemName"
    },
    {
      label:"الكمية",
      key:"quantity"
    },
    {
      label:"وحدة القياس",
      key:"itemYear"
    }
    ]
  @ViewChild('form') form: NgForm;
  @ViewChild('branchDropdown') branchDropdown: DropdownListComponent;
  @ViewChild('datepicker') datepicker: GregorianHijriCalendarComponent;

  constructor(
    private branchService:BranchesService,
    private mngrOrderService: MngrOrdersService,
    private notifier: NotifierService,
    private spinner: NgxSpinnerService,
    private swalService: SwalService,
    private route: ActivatedRoute,
    private permissionsService: PermissionsService
  ) { }

  ngOnInit() {
    this.permission = this.permissionsService.getPermission(PERMISSIONS.mngrOrders);
    this.listAllBranches();
    if(this.route.snapshot.params.serial) {
      this.getById(this.route.snapshot.params.serial);
    }
    else{
      this.reset()
    }
  }
  listAllBranches(){
   this.dropdownsLoading = true;
   this.branchService.getAll().subscribe(
     res => {
       this.branches=res;
       this.dropdownsLoading = false;
     },
     err => {
      this.dropdownsLoading = false;
     }

   );
  }

  selectDate(date) {
    this.MangrOrder.date = date.greg
    this.MangrOrder.dateH = date.hijri
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
      this.MangrOrder =  Object.assign({}, this.MangrOrderPackup)
    } else {
      this.reset();
    }
  }
  create() {
    this.mngrOrderService.create(this.MangrOrder).subscribe(
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
    this.mngrOrderService.update(this.MangrOrder.serial,this.MangrOrder).subscribe(
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
    this.swalService.showRemoveConfirmation(this.MangrOrder.serial).then(
      result => {
        if(result.value) {
          this.mngrOrderService.delete(this.MangrOrder.serial).subscribe(
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
    this.branchDropdown.reset();
    this.datepicker.reset();
    setTimeout(() => {
      this.MangrOrder = new MngrOrder();
      this.getNewId();
    }, 50);
    this.isEdit = false;
    this.rank = null;
    this.totalCount = null;
  }
  getNewId() {
    this.mngrOrderService.getNewId().subscribe(
      res => {
        this.MangrOrder.serial = res;
      }
    )
  }
  getById(id:number) {
    this.spinner.show();
    this.mngrOrderService.get(id).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }

  getNext() {
    this.spinner.show();
    this.mngrOrderService.getNextRow(this.rank).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  getPrevious() {
    this.spinner.show();
    this.mngrOrderService.getPreviousRow(this.rank).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  getFirst() {
    this.spinner.show();
    this.mngrOrderService.getFirstRow().subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  getLast() {
    this.spinner.show();
    this.mngrOrderService.getLastRow().subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  setItemFromResponse(res: ResultWithRanking<MngrOrder>) {
    this.MangrOrder = res.result;
    this.rank = res.rank;
    this.totalCount = res.totalCount;
    this.MangrOrderPackup =  Object.assign({}, this.MangrOrder)
    this.isEdit=true;
    this.spinner.hide();
  }
  getItemErrorHandler(err) {
    let errorMessage = err.message || 'غير موجود';
    this.notifier.notify('error', errorMessage);
    this.spinner.hide();
  }

  selectBranch(branch: Branch) {
    this.MangrOrder.branchId = branch.branchId;
  }

}

