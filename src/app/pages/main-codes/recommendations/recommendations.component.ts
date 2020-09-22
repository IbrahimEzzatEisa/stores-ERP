import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';

import { Recommendations } from '../../../shared/models';
import { RecommendationsService } from '../../../shared/services';
import { PERMISSIONS } from 'src/app/shared/services';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.css']
})
export class RecommendationsComponent implements OnInit {

  itemsTypes: Recommendations[];
  busyCreating: boolean = false;  
  busyPrinting: boolean = false;
  permissionId: number = PERMISSIONS.recommendations;
  @ViewChild('table') table;

  constructor(
    private componentService:RecommendationsService,
    private spinner: NgxSpinnerService,
    private notifier: NotifierService
    ) { }

  ngOnInit() {
  }
 
  getAll(){
    this.spinner.show();
    this.componentService.getAll().subscribe(
    (res:Recommendations[])=>{
        this.itemsTypes = res;
        this.spinner.hide();
      },
      err=>{
        this.spinner.hide();
      }
    );
  }

  create(model: Recommendations) {
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

  update(model: Recommendations) {
    this.componentService.update(model.recommendationId, model).subscribe(
      res => {
        const index = this.itemsTypes.findIndex(item => item.recommendationId==res.recommendationId);
        this.itemsTypes[index] = res;
        this.notifier.notify('success', 'تم التعديل بنجاح');
        this.updateTable();
      },
      err => {
        const index = this.itemsTypes.findIndex(item => item.recommendationId==model.recommendationId);
        this.itemsTypes[index]['busy'] = false;
        this.notifier.notify('error', err.message || 'حدث خطأ اثناء التعديل');
        this.updateTable();
      }
    );
  } 

  delete(id: number) {
    this.componentService.delete(id).subscribe(
      res => {
        const index = this.itemsTypes.findIndex(item => item.recommendationId == res.recommendationId)
        this.itemsTypes.splice(index, 1)
        this.notifier.notify('success', 'تم الحذف بنجاح');
        this.updateTable();
      },
      err => {
        const index = this.itemsTypes.findIndex(item => item.recommendationId == id);
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
