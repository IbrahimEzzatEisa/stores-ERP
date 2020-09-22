import { Component, OnInit, ViewChild } from '@angular/core';
import { Specification } from 'src/app/shared/models';
import { SpecificationService, PERMISSIONS } from 'src/app/shared/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-specifications',
  templateUrl: './specifications.component.html',
  styleUrls: ['./specifications.component.css']
})
export class SpecificationsComponent implements OnInit {

  itemsTypes: Specification[];
  busyCreating: boolean = false;
  busyPrinting: boolean = false;
  permissionId: number = PERMISSIONS.specifications;
  @ViewChild('table') table;

  constructor(
    private componentService: SpecificationService,
    private spinner: NgxSpinnerService,
    private notifier: NotifierService,
  ) { }

  getAll() {
    this.spinner.show();
    this.componentService.getAll().subscribe(
      res => {
        this.itemsTypes = res;
        this.spinner.hide();
        this.updateTable();
      },
      err => {
        this.spinner.hide();
        this.notifier.notify("error", err.message);
        this.updateTable();
      }
    )
  }

  create(model: Specification) {
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
        this.notifier.notify("error", err.message || 'حدث خطأ اثناء الحفظ');
        this.busyCreating = false;
        this.updateTable();
      }
    );
  }

  update(model: Specification) {
    this.componentService.update(model.specificationId, model).subscribe(
      res => {
        const index = this.itemsTypes.findIndex(item => item.specificationId==res.specificationId);
        this.itemsTypes[index] = res;
        this.notifier.notify('success', 'تم التعديل بنجاح');
        this.updateTable();
      },
      err => {
        this.notifier.notify("error", err.message || 'حدث خطأ اثناء التعديل');
        const index = this.itemsTypes.findIndex(item => item.specificationId==model.specificationId);
        this.itemsTypes[index]['busy'] = false;
        this.updateTable();
      }
    );
  }

  delete(id: number) {
    this.componentService.delete(id).subscribe(
      res => {
        const index = this.itemsTypes.findIndex(item => item.specificationId == res.specificationId)
        this.itemsTypes.splice(index, 1);
        this.notifier.notify('success', 'تم الحذف بنجاح');
        this.updateTable();
      },
      err => {
        this.notifier.notify("error", err.message || 'حدث خطأ اثناء الحذف');
        const index = this.itemsTypes.findIndex(item => item.specificationId == id);
        this.itemsTypes[index]['busy'] = false;
        this.updateTable();
      }
    )
  }

  updateTable() {
    this.table.refresh()
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

  
  ngOnInit(){

  }

}
