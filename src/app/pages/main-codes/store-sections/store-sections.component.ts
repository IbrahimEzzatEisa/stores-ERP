import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';


import { StoreSectionsService } from '../../../shared/services/api/store-sections.service';
import { PERMISSIONS } from 'src/app/shared/services';
import { StoreSection } from '../../../shared/models';

@Component({
  selector: 'app-store-sections',
  templateUrl: './store-sections.component.html',
  styleUrls: ['./store-sections.component.css']
})
export class StoreSectionsComponent implements OnInit {

  itemsTypes: StoreSection[];
  busyCreating: boolean = false;
  busyPrinting: boolean = false;
  permissionId: number = PERMISSIONS.storeSections;
  @ViewChild('table') table; 

  constructor(
    private componentService:StoreSectionsService,
    private spinner: NgxSpinnerService,
    private notifier: NotifierService,


    ) { }
  selectedRow;
  selectedRowId
  updatedRowOldValue;
  ngOnInit() {
  }
 
  getAll(){
    this.spinner.show();
    this.componentService.getAll().subscribe(
    (res:StoreSection[])=>{
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
  create(model: StoreSection) {
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
        alert(err.message || "Error!")
      }
    );
  }
 
  update(model: StoreSection) {
    this.componentService.update(model.storeSectionId, model).subscribe(
      res => {
        const index = this.itemsTypes.findIndex(item => item.storeSectionId==res.storeSectionId);
        this.itemsTypes[index] = res;
        this.notifier.notify('success', 'تم التعديل بنجاح');
        this.updateTable();
      },
      err => {
        const index = this.itemsTypes.findIndex(item => item.storeSectionId==model.storeSectionId);
        this.itemsTypes[index]['busy'] = false;
        this.notifier.notify('error', err.message || 'حدث خطأ اثناء التعديل');
        this.updateTable();
      }
    );
  }

  delete(id: number) {
    this.componentService.delete(id).subscribe(
      res => {
        const index = this.itemsTypes.findIndex(item => item.storeSectionId == res.storeSectionId)
        this.itemsTypes.splice(index, 1)
        this.notifier.notify('success', 'تم الحذف بنجاح');

      },
      err => {
        const index = this.itemsTypes.findIndex(item => item.storeSectionId == id);
        this.itemsTypes[index]['busy'] = false;
        this.notifier.notify('error', err.message || 'حدث خطأ اثناء الحذف');
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
