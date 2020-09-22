import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute } from '@angular/router';

import { WorkPlace, ResultWithRanking, Permission } from 'src/app/shared/models';
import { WorkPlacesService, SwalService, PermissionsService, PERMISSIONS } from 'src/app/shared/services';

@Component({
  selector: 'app-work-places-add-edit',
  templateUrl: './work-places-add-edit.component.html',
  styleUrls: ['./work-places-add-edit.component.css']
})
export class WorkPlacesAddEditComponent implements OnInit {

  workPlace: WorkPlace;
  workPlacePackup: WorkPlace;

  rank: number;
  totalCount: number;

  isEdit:Boolean= false;
  busySaving: boolean = false;
  dropdownsLoading: boolean = false;
  busyPrinting: boolean = false;
  permission: Permission;

  @ViewChild('form') form;

  constructor(
    private componentService: WorkPlacesService,
    private spinner: NgxSpinnerService,
    private notifier: NotifierService,
    private route: ActivatedRoute,
    private swalService: SwalService,
    private permissionsService: PermissionsService

  ) { }

  ngOnInit() {
    this.permission = this.permissionsService.getPermission(PERMISSIONS.workPlaces);

    this.workPlace = new WorkPlace();
    const params = this.route.snapshot.params;
    if(params.id || params.id==0) {
      this.getById(params.id);
    }
    else{
      this.reset();
    }
  }

  save(){
    if(this.isEdit)
      this.update();
    else
      this.create();
  }
  cancel() {
    if(this.isEdit) {
      this.workPlace =  Object.assign({}, this.workPlacePackup)
    } else {
      this.reset();
    }
  }
  create() {
    this.busySaving = true;
    this.componentService.create(this.workPlace).subscribe(
      res => {
        this.notifier.notify('success', 'تم الحفظ بنجاح');
        this.reset();
        this.busySaving = false;
      },
      err => {
        console.log("err", err);
        this.notifier.notify('error', 'حدث خطأ اثناء الحفظ');
        this.busySaving = false;

      }
    );
  }
  update() {
    this.busySaving = true;
    this.componentService.update(this.workPlace.workPlaceId, this.workPlace).subscribe(
      res => {
        this.workPlace=res;
        console.log("edit res, ",res);
        this.notifier.notify('success', 'تم الحفظ بنجاح');
        this.busySaving = false;
        //this.reset();
      },
      err => {
        console.log("err", err);
        this.notifier.notify('error', 'حدث خطأ اثناء الحفظ');
        this.busySaving = false;

      }
    );
  }
  delete() {
    this.swalService.showRemoveConfirmation(this.workPlace.workPlaceName).then(
      result => {
        if(result.value) {
          this.componentService.delete(this.workPlace.workPlaceId).subscribe(
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
    setTimeout(()=>{this.workPlace = new WorkPlace();}, 50);
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
    this.componentService.getPrevious(this.workPlace.workPlaceId).subscribe(
      this.setClientFromResponse.bind(this), this.getClintErrorHandler.bind(this)
    );
  }
  getNext(){
    this.spinner.show();
    this.componentService.getNext(this.workPlace.workPlaceId).subscribe(
      this.setClientFromResponse.bind(this), this.getClintErrorHandler.bind(this)
    );
  }
  getLast(){
    this.spinner.show();
    this.componentService.getLast().subscribe(
      this.setClientFromResponse.bind(this), this.getClintErrorHandler.bind(this)
    );
  }

  setClientFromResponse(res: ResultWithRanking<WorkPlace>) {
    this.workPlace = res.result;
    this.rank = res.rank;
    this.totalCount = res.totalCount;
    this.workPlacePackup =  Object.assign({}, this.workPlace)
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
        this.workPlace.workPlaceId = res;
      }
    );
  }
  print() {
    this.busyPrinting = true;
    this.componentService.printReport().subscribe(
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
  
  // save(){
  //   if(this.isEdit)
  //     this.update();
  //   else
  //     this.create();
  // }
  // cancel(){
  //   if(this.isEdit)
  //     {
  //       this.workPlace=Object.assign({},this.originalWorkPlace);
  //     }
  //   else
  //     this.reset();
  // }
  // create() {
  //   this.busySaving = true;
  //   this.componentService.create(this.workPlace).subscribe(
  //     res => {
  //       this.notifier.notify('success', 'تم الحفظ بنجاح');
  //       this.busySaving = false;
  //       this.reset();
  //     },
  //     err => {
  //       console.log("err", err);
  //       this.notifier.notify('error', 'حدث خطأ اثناء الحفظ');
  //       this.busySaving = false;

  //     }
  //   );
  // }
  // update() {
  //   this.busySaving = true;
  //   this.componentService.update(this.workPlace.workPlaceId,this.workPlace).subscribe(
  //     res => {
  //       this.workPlace=res;
  //       console.log("edit res, ",res);
  //       this.notifier.notify('success', 'تم الحفظ بنجاح');
  //       this.busySaving = false;
  //       //this.reset();
  //     },
  //     err => {
  //       console.log("err", err);
  //       this.notifier.notify('error', 'حدث خطأ اثناء الحفظ');
  //       this.busySaving = false;

  //     }
  //   );
  // }
  // delete(id: number) {
  //   this.componentService.delete(id).subscribe(
  //     res => {
  //       this.notifier.notify('success', 'تم الحذف بنجاح');
  //     },
  //     err => {
  //       this.notifier.notify('error', 'حدث خطأ اثناء الحذف');
  //     }
  //   )
  // }


}
