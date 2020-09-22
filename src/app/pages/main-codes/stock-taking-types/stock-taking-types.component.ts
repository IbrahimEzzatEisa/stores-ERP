import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';

import { StockTakingType } from 'src/app/shared/models';
import { StockTakingTypesService, PERMISSIONS } from 'src/app/shared/services';

@Component({
  selector: 'app-stock-taking-types',
  templateUrl: './stock-taking-types.component.html',
  styleUrls: ['./stock-taking-types.component.css']
})
export class StockTakingTypesComponent implements OnInit {

  componentList: StockTakingType[];
  busyCreating: boolean = false;
  busyPrinting: boolean = false;
  permissionId: number = PERMISSIONS.stockTakingTypes;
  @ViewChild('table') table;

  constructor(
    private componentService: StockTakingTypesService,
    private spinner: NgxSpinnerService,
    private notifier: NotifierService
  ) { }
  ngOnInit() {
  }
 
  getAll(){
    this.spinner.show();
    this.componentService.getAll().subscribe(
    res => {
      this.componentList = res;
      this.spinner.hide();
    },
    err=>{
      this.spinner.hide();

    }
  );

  }

  create(model: StockTakingType) {
    this.busyCreating = true;
    this.componentService.create(model).subscribe(
      res => {
        this.componentList.push(res);
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

  update(model: StockTakingType) {
    this.componentService.update(model.stockTakingTypeId, model).subscribe(
      res => {
        const index = this.componentList.findIndex(item => item.stockTakingTypeId==res.stockTakingTypeId);
        this.componentList[index] = res;
        this.notifier.notify('success', 'تم التعديل بنجاح');
        this.table.refresh();
      },
      err => {
        const index = this.componentList.findIndex(item => item.stockTakingTypeId==model.stockTakingTypeId);
        this.componentList[index]['busy'] = false;
        this.notifier.notify('error', err.message || 'حدث خطأ اثناء التعديل');
        this.table.refresh();
      }
    );
  } 

  delete(id: number) {
    this.componentService.delete(id).subscribe(
      res => {
        const index = this.componentList.findIndex(item => item.stockTakingTypeId == res.stockTakingTypeId)
        this.componentList.splice(index, 1)
        this.notifier.notify('success', 'تم الحذف بنجاح');
        this.table.refresh();

      },
      err => {
        const index = this.componentList.findIndex(item => item.stockTakingTypeId == id);
        this.componentList[index]['busy'] = false;
        this.notifier.notify('error', err.message || 'حدث خطأ اثناء الحذف');
        this.table.refresh();
      }
    )
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
  updateTable() {
    this.table.refresh();
  }

  canDeactivate() {
    return this.table.canDeactivate();
  }

}
