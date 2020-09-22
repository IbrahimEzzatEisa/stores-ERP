import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';

import { ItemType } from 'src/app/shared/models';
import { ItemTypesService } from 'src/app/shared/services/api/item-types.service';
import { PERMISSIONS } from 'src/app/shared/services';

@Component({
  selector: 'app-item-types',
  templateUrl: './item-types.component.html',
  styleUrls: ['./item-types.component.css']
})
export class ItemTypesComponent implements OnInit {

  itemsTypes: ItemType[];
  busyCreating: boolean = false;
  busyPrinting: boolean = false;
  permissionId: number = PERMISSIONS.itemTypes;
  @ViewChild('table') table;

  constructor(
    private componentService:ItemTypesService,
    private spinner: NgxSpinnerService,
    private notifier: NotifierService,


    ) { }
  ngOnInit() {
  }
 
  getAll(){
    this.spinner.show();
    this.componentService.getAll().subscribe(
    (res:ItemType[])=>{
      this.itemsTypes = res;
      this.spinner.hide();
    },
    err=>{
      this.spinner.hide();

    }
  );

  }

  create(model: ItemType) {
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

  update(model: ItemType) {
    this.componentService.update(model.itemTypeId, model).subscribe(
      res => {
        const index = this.itemsTypes.findIndex(item => item.itemTypeId==res.itemTypeId);
        this.itemsTypes[index] = res;
        this.notifier.notify('success', 'تم التعديل بنجاح');
        this.table.refresh();
      },
      err => {
        const index = this.itemsTypes.findIndex(item => item.itemTypeId==model.itemTypeId);
        this.itemsTypes[index]['busy'] = false;
        this.notifier.notify('error', err.message || 'حدث خطأ اثناء التعديل');
        this.table.refresh();
      }
    );
  } 

  delete(id: number) {
    this.componentService.delete(id).subscribe(
      res => {
        const index = this.itemsTypes.findIndex(item => item.itemTypeId == res.itemTypeId)
        this.itemsTypes.splice(index, 1)
        this.notifier.notify('success', 'تم الحذف بنجاح');
        this.table.refresh();

      },
      err => {
        const index = this.itemsTypes.findIndex(item => item.itemTypeId == id);
        this.itemsTypes[index]['busy'] = false;
        this.notifier.notify('error', err.message || 'حدث خطأ اثناء الحذف');
        this.table.refresh();
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
