import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';

import { StoreTypesService, PERMISSIONS } from '../../../shared/services';
import { StoreType } from '../../../shared/models';


@Component({
  selector: 'app-store-types',
  templateUrl: './store-types.component.html',
  styleUrls: ['./store-types.component.css']
})
export class StoreTypesComponent implements OnInit {
  
  itemsTypes: StoreType[];
  busyCreating: boolean = false;
  busyPrinting: boolean = false;

  permissionId: number = PERMISSIONS.storeTypes;
  @ViewChild('table') table; 

  constructor(
    private componentService:StoreTypesService,
    private spinner: NgxSpinnerService,
    private notifier: NotifierService,


    ) { }
  ngOnInit() {}
 
  getAll(){
    this.spinner.show();
    this.componentService.getAll().subscribe(
    (res:StoreType[])=>{
      this.itemsTypes = res;
      this.spinner.hide();

      console.log("store sections response ---->>>>",res);
    },
    err=>{
      this.spinner.hide();
      console.log("store sections error ---->>>>",err);

    }
  );

  }

  create(model: StoreType) {
    this.busyCreating = true;
    this.componentService.create(model).subscribe(
      res => {
        this.itemsTypes.push(res);
        this.busyCreating = false;
        this.notifier.notify('success', 'تم الحفظ بنجاح');
        this.updateTable();
      },
      err => {
        console.log("err", err);
        this.notifier.notify('error', err.message || 'حدث خطأ اثناء الحفظ');
        this.busyCreating = false;
        this.updateTable();
      }
    );
  }

  update(model: StoreType) {
    this.componentService.update(model.storeTypeId, model).subscribe(
      res => {
        const index = this.itemsTypes.findIndex(item => item.storeTypeId==res.storeTypeId);
        this.itemsTypes[index] = res;
        this.notifier.notify('success', 'تم التعديل بنجاح');
        this.updateTable();
      },
      err => {
        const index = this.itemsTypes.findIndex(item => item.storeTypeId==model.storeTypeId);
        this.itemsTypes[index]['busy'] = false;
        this.notifier.notify('error', err.message || 'حدث خطأ اثناء التعديل');
        this.updateTable();
      }
    );
  }

  delete(id: number) {
    this.componentService.delete(id).subscribe(
      res => {
        const index = this.itemsTypes.findIndex(item => item.storeTypeId == res.storeTypeId)
        this.itemsTypes.splice(index, 1)
        this.notifier.notify('success', 'تم الحذف بنجاح');
        this.updateTable();
      },
      err => {
        const index = this.itemsTypes.findIndex(item => item.storeTypeId == id);
        this.itemsTypes[index]['busy'] = false;
        this.notifier.notify('error', err.message || 'حدث خطأ اثناء الحذف');
        this.updateTable();
      }
    )
  }
  
  updateTable() {
    this.table.refresh();
  }

  canDeactivate() {
    return this.table.canDeactivate();
  }
  print(){
    this.busyPrinting = true
    this.componentService.printReport().subscribe(
      (res:any)=>{
        console.log("print res ",res)
        if(res.pdfUrl) {
          window.open(res.pdfUrl, "_blank", 'location=yes,height=600,width=900,scrollbars=yes,status=yes');
          this.busyPrinting = false;
        }
      },
      err=>{
        this.busyPrinting = false;
        console.log("print err ",err)
        let errorMessage = err.message || 'خطأ فى الحصول على ملف الطباعة';
        this.notifier.notify('error', errorMessage);
        
      }
    );
  }

}
