import { Component, OnInit, ViewChild} from '@angular/core';
import { UnitsService, PERMISSIONS} from 'src/app/shared/services';
import { Unit } from 'src/app/shared/models';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';
@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class UnitsComponent implements OnInit {

  itemsTypes: Unit[];
  busyCreating: boolean = false;
  busyPrinting: boolean = false;
  permissionId: number = PERMISSIONS.units;
  @ViewChild('table') table; 
  
  constructor(
    private componentService: UnitsService,
    private spinner: NgxSpinnerService,
    private notifier: NotifierService,
  ) { }

  getAll() {
    this.spinner.show();
    this.componentService.getAll().subscribe(
      res => {
        this.itemsTypes = res;
        this.updateTable();
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        this.notifier.notify("error", err.message);
      }
    )
  }

  create(model: Unit) {
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

  update(model: Unit) {
    this.componentService.update(model.unitId, model).subscribe(
      res => {
        const index = this.itemsTypes.findIndex(item => item.unitId==res.unitId);
        this.itemsTypes[index] = res;
        this.notifier.notify('success', 'تم التعديل بنجاح');
        this.updateTable();
      },
      err => {
        this.notifier.notify("error", err.message || 'حدث خطأ اثناء التعديل');
        const index = this.itemsTypes.findIndex(item => item.unitId==model.unitId);
        this.itemsTypes[index]['busy'] = false;
        this.updateTable();
      }
    );
  }

  delete(id: number) {
    this.componentService.delete(id).subscribe(
      res => {
        const index = this.itemsTypes.findIndex(item => item.unitId == res.unitId)
        this.itemsTypes.splice(index, 1);
        this.notifier.notify('success', 'تم الحذف بنجاح');
        this.updateTable();
      },
      err => {
        this.notifier.notify("error", err.message || 'حدث خطأ اثناء الحذف');
        const index = this.itemsTypes.findIndex(item => item.unitId == id);
        this.itemsTypes[index]['busy'] = false;
        this.updateTable();
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

  ngOnInit(){

  }

}
