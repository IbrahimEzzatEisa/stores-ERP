import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Store, StoreType, StoreKeeper, ResultWithRanking, Permission } from '../../../shared/models';
import { StoresService, StoreTypesService, StoreKeepersService, SwalService, PermissionsService, PERMISSIONS } from '../../../shared/services';

@Component({
  selector: 'app-stores-add-edit',
  templateUrl: './stores-add-edit.component.html',
  styleUrls: ['./stores-add-edit.component.css']
})
export class StoresAddEditComponent implements OnInit {

  store: Store;
  storePackup: Store;
  StoresTypes:StoreType[];
  storeKeepers:StoreKeeper[];

  rank: number;
  totalCount: number;

  isEdit:Boolean= false;
  busySaving: boolean = false;
  dropdownsLoading: boolean = false;
  busyPrinting: boolean = false;

  permission: Permission;

  @ViewChild('form') form;

  constructor(
    private componentService: StoresService,
    private storeTypeService:StoreTypesService,
    private storeKeeperService:StoreKeepersService,
    private spinner: NgxSpinnerService,
    private notifier: NotifierService,
    private route: ActivatedRoute,
    private swalService: SwalService,
    private permissionsService: PermissionsService
  ) { }

  ngOnInit() {
    this.permission = this.permissionsService.getPermission(PERMISSIONS.stores);

    this.getDropDowns();

    this.store = new Store();
    const params = this.route.snapshot.params;
    if(params.id || params.id==0) {
      this.getById(params.id);
    }
    else{
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
      this.store =  Object.assign({}, this.storePackup)
    } else {
      this.reset();
    }
  }
  create() {
    this.busySaving = true;
    this.componentService.create(this.store).subscribe(
      res => {
        this.notifier.notify('success', 'تمت الإضافة بنجاح');
        this.reset();
        this.busySaving = false;

      },
      err => {
        this.notifier.notify('error', 'حدث خطأ اثناء الإضافة');
        this.busySaving = false;

      }
    );
  }
  update() {
    this.busySaving = true;
    this.componentService.update(this.store.storeId, this.store, this.rank, this.totalCount).subscribe(
      res => {
        this.setClientFromResponse(res);
        this.busySaving = false;
        this.notifier.notify('success', 'تم التعديل  بنجاح');
      },
      err => {
        this.busySaving = false;
        const errorMessage = err.message || 'حدث خطأ اثناء التعديل';
        this.notifier.notify('error', errorMessage);

      }
    );
  }
  delete() {
    this.swalService.showRemoveConfirmation(this.store.storeName).then(
      result => {
        if(result.value) {
          this.componentService.delete(this.store.storeId).subscribe(
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
  getById(id: number){
    this.spinner.show();
    this.componentService.get(id).subscribe(
      this.setClientFromResponse.bind(this), this.getClintErrorHandler.bind(this)
    );
  }
  reset() {
    this.form.reset();
    setTimeout(()=>{this.store = new Store();}, 50);
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
    this.componentService.getPrevious(this.store.storeId).subscribe(
      this.setClientFromResponse.bind(this), this.getClintErrorHandler.bind(this)
    );
  }
  getNext(){
    this.spinner.show();
    this.componentService.getNext(this.store.storeId).subscribe(
      this.setClientFromResponse.bind(this), this.getClintErrorHandler.bind(this)
    );
  }
  getLast(){
    this.spinner.show();
    this.componentService.getLast().subscribe(
      this.setClientFromResponse.bind(this), this.getClintErrorHandler.bind(this)
    );
  }

  setClientFromResponse(res: ResultWithRanking<Store>) {
    this.store = res.result;
    this.rank = res.rank;
    this.totalCount = res.totalCount;
    this.storePackup =  Object.assign({}, this.store)
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
        this.store.storeId = res;
      }
    );
  }
  getDropDowns() {
    this.dropdownsLoading = true;
    forkJoin([
      this.storeTypeService.getAll(),
      this.storeKeeperService.getAll()
    ]).subscribe(
      res => {
        this.StoresTypes = res[0];
        this.storeKeepers = res[1];
        this.dropdownsLoading = false;
      },
      err => {
        this.dropdownsLoading = false;
      }
    )
  }

  print() {
    this.busyPrinting = true;
    this.componentService.printReport().subscribe(
      (res: any) => {
        if (res.pdfUrl) {
          window.open(res.pdfUrl, "_blank", 'location=yes,height=600,width=900,scrollbars=yes,status=yes');
          this.busyPrinting = false;
        }
      },
      err => {
        let errorMessage = err.message || 'خطأ فى الحصول على ملف الطباعة';
        this.notifier.notify('error', errorMessage);
        this.busyPrinting = false;
      }
    )
  }

}
