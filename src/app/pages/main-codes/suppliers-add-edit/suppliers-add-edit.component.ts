import { Component, OnInit, ViewChild } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';

import { Supplier, ResultWithRanking, Permission } from '../../../shared/models';
import { SuppliersService, SwalService, PermissionsService, PERMISSIONS } from '../../../shared/services';

@Component({
  selector: 'app-suppliers-add-edit',
  templateUrl: './suppliers-add-edit.component.html',
  styleUrls: ['./suppliers-add-edit.component.css']
})
export class SuppliersAddEditComponent implements OnInit {


  supplier: Supplier;
  supplierPackup: Supplier;
  permission: Permission
  rank: number;
  totalCount: number;
  busyPrinting: boolean = false;
  isEdit:Boolean= false;
  busySaving: boolean = false;
  dropdownsLoading: boolean = false;
  pattern=new RegExp('[a-zA-Z, \u0600-\u06FF]+');

  @ViewChild('form') form;

  constructor(
    private componentService: SuppliersService,
    private permissionsService: PermissionsService,
    private spinner: NgxSpinnerService,
    private notifier: NotifierService,
    private route: ActivatedRoute,
    private swalService: SwalService
  ) { }

  ngOnInit() {
    this.supplier = new Supplier();
    this.permission = this.permissionsService.getPermission(PERMISSIONS.suppliers);
    console.log("this.permission", this.permission);
    const params = this.route.snapshot.params;
    if(params.id || params.id==0) {
      this.getById(params.id);
    }
    else {
      this.reset();
    }
  }

  save(){
    if(this.isEdit){
      this.update();
    }else{
      this.create();
    }
  }
  cancel() {
    if(this.isEdit) {
      this.supplier =  Object.assign({}, this.supplierPackup)
    } else {
      this.reset();
    }
  }

  create() {
    this.busySaving = true;
    this.componentService.create(this.supplier).subscribe(
      res => {
        this.notifier.notify('success', 'تم الحفظ بنجاح');
        this.reset();
        this.busySaving = false;
      },
      err => {
        const errMessage = err.message || 'حدث خطأ اثناء الإضافة';
        this.notifier.notify('error', errMessage);
        this.busySaving = false;
      }
    );
  }
  update() {
    this.busySaving = true;
    this.componentService.update(this.supplier.supplierId, this.supplier).subscribe(
      res => {
        this.setClientFromResponse(res);
        this.busySaving = false;
        this.notifier.notify('success', 'تم التعديل  بنجاح');
      },
      err => {
        const errMessage = err.message || 'حدث خطأ اثناء التعديل';
        this.notifier.notify('error', errMessage);
        this.busySaving = false;
      }
    );
  }
  delete() {
    this.swalService.showRemoveConfirmation(this.supplier.supplierName).then(
      result => {
        if(result.value) {
          this.componentService.delete(this.supplier.supplierId).subscribe(
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

  getById(cuurentId){
    this.spinner.show();
    this.componentService.get(cuurentId).subscribe(
      this.setClientFromResponse.bind(this), this.getClintErrorHandler.bind(this)
    );
  }
  reset() {
    this.form.reset();
    setTimeout(()=>{this.supplier = new Supplier();}, 50);
    this.isEdit = false;
    this.rank = null;
    this.totalCount = null;
    this.getNewId();
  }

  getFirst(){
    this.spinner.show();
    this.componentService.getFirst().subscribe(
      this.setClientFromResponse.bind(this), this.getClintErrorHandler.bind(this)

    );
  }
  getPrevious(){
    this.spinner.show();
    this.componentService.getPrevious(this.supplier.supplierId).subscribe(
      this.setClientFromResponse.bind(this), this.getClintErrorHandler.bind(this)
    );
  }
  getNext(){
    this.spinner.show();
    this.componentService.getNext(this.supplier.supplierId).subscribe(
      this.setClientFromResponse.bind(this), this.getClintErrorHandler.bind(this)
    );
  }
  getLast(){
    this.spinner.show();
    this.componentService.getLast().subscribe(
      this.setClientFromResponse.bind(this), this.getClintErrorHandler.bind(this)
    );
  }

  setClientFromResponse(res: ResultWithRanking<Supplier>) {
    this.supplier = res.result;
    this.rank = res.rank;
    this.totalCount = res.totalCount;
    this.supplierPackup =  Object.assign({}, this.supplier)
    this.isEdit = true;
    this.spinner.hide();
  }
  getClintErrorHandler(err) {
    const errorMessage = err.message || 'غير موجود';
    this.notifier.notify('error', errorMessage);
    this.spinner.hide();
  }

  getNewId(){
    this.componentService.getNewId().subscribe(
      res=>{
        this.supplier.supplierId=res;
      }
    );
  }
  print() {
    this.busyPrinting = true;
    this.componentService.printReport(this.supplier.supplierId).subscribe(
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

  preventNumberInput(event: any) {
    console.log(event)
    const inputChar = String.fromCharCode(event.charCode);
    if (!this.pattern.test(inputChar)) {    
      event.preventDefault();
    }
  }
  

  

}
