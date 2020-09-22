import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';

import { StoreKeeper } from 'src/app/shared/models';
import { StoreKeepersService, PERMISSIONS } from 'src/app/shared/services';

@Component({
  selector: 'app-store-keepers',
  templateUrl: './store-keepers.component.html',
  styleUrls: ['./store-keepers.component.css']
})
export class StoreKeepersComponent implements OnInit {
  
  storesKeepers: StoreKeeper[];
  busyCreating: boolean = false;
  busyPrinting: boolean = false;
  permissionId: number = PERMISSIONS.storeKeepers;
  pattern = new RegExp('[a-zA-Z, \u0600-\u06FF]+');
  @ViewChild('table') table;

  constructor(
    private componentService: StoreKeepersService,
    private spinner: NgxSpinnerService,
    private notifier: NotifierService
    ) { }
  ngOnInit() {
  }
 
  getAll(){
    this.spinner.show();
    this.componentService.getAll().subscribe(
    res=> {
      this.storesKeepers = res;
      this.spinner.hide();
    },
    err=>{
      this.spinner.hide();

    }
  );

  }

  create(model: StoreKeeper) {
    this.busyCreating = true;
    this.componentService.create(model).subscribe(
      res => {
        this.storesKeepers.push(res);
        this.busyCreating = false;
        this.notifier.notify('success', 'تم الحفظ بنجاح');
        this.updateTable();
      },
      err => {
        console.log("err", err);
        this.notifier.notify('error', 'حدث خطأ اثناء الحفظ');
        this.busyCreating = false;
        this.updateTable();
      }
    );
  }

  update(model: StoreKeeper) {
    this.componentService.update(model.storeKeeperId, model).subscribe(
      res => {
        const index = this.storesKeepers.findIndex(item => item.storeKeeperId==res.storeKeeperId);
        this.storesKeepers[index] = res;
        this.notifier.notify('success', 'تم التعديل بنجاح');
        this.table.refresh();
      },
      err => {
        const index = this.storesKeepers.findIndex(item => item.storeKeeperId==model.storeKeeperId);
        this.storesKeepers[index]['busy'] = false;
        this.notifier.notify('error', 'حدث خطأ اثناء التعديل');
        this.table.refresh();
      }
    );
  } 

  delete(id: number) {
    this.componentService.delete(id).subscribe(
      res => {
        const index = this.storesKeepers.findIndex(item => item.storeKeeperId == res.storeKeeperId)
        this.storesKeepers.splice(index, 1)
        this.notifier.notify('success', 'تم الحذف بنجاح');
        this.table.refresh();
      },
      err => {
        const index = this.storesKeepers.findIndex(item => item.storeKeeperId == id);
        this.storesKeepers[index]['busy'] = false;
        this.notifier.notify('error', err.message || 'حدث خطأ اثناء الحذف');
        this.table.refresh();
      }
    )
  }

 print(){
    this.busyPrinting = true
    this.componentService.printReport().subscribe(
      (res:any)=>{
        if(res.pdfUrl) {
          window.open(res.pdfUrl, "_blank", 'location=yes,height=600,width=900,scrollbars=yes,status=yes');
          this.busyPrinting = false;
        }
      },
      err=>{
        this.busyPrinting = false;
        let errorMessage = err.message || 'خطأ فى الحصول على ملف الطباعة';
        this.notifier.notify('error', errorMessage);
        
      }
    );
  }
  updateTable() {
    this.table.refresh();
  }

  canDeactivate() {
    return this.table.canDeactivate();
  }

}
