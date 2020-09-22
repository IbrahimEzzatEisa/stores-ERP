import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';

import { BranchesService, PERMISSIONS } from 'src/app/shared/services';
import { Branch } from 'src/app/shared/models';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css']
})
export class BranchesComponent implements OnInit {

  itemsTypes: Branch[];
  busyCreating: boolean = false;
  busyPrinting: boolean = false;
  permissionId: number = PERMISSIONS.branches;
  @ViewChild('table') table;

  constructor(
    private componentService:BranchesService,
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

  create(model: Branch) {
    this.busyCreating = true;
    this.componentService.create(model).subscribe(
      res => {
        this.itemsTypes.push(res);
        this.busyCreating = false;
        this.notifier.notify('success', 'تم الحفظ بنجاح');
        this.updateTable();
      },
      err => {
        this.notifier.notify("error", err.message || 'حدث خطأ اثناء الحفظ');
        this.busyCreating = false;
        this.updateTable();
      }
    );
  }

  update(model: Branch) {
    this.componentService.update(model.branchId, model).subscribe(
      res => {
        const index = this.itemsTypes.findIndex(item => item.branchId==res.branchId);
        this.itemsTypes[index] = res;
        this.notifier.notify('success', 'تم التعديل بنجاح');
        this.updateTable();
      },
      err => {
        this.notifier.notify("error", err.message || 'حدث خطأ اثناء التعديل');
        const index = this.itemsTypes.findIndex(item => item.branchId==model.branchId);
        this.itemsTypes[index]['busy'] = false;
        this.updateTable();
      }
    );
  }

  delete(id: number) {
    this.componentService.delete(id).subscribe(
      res => {
        const index = this.itemsTypes.findIndex(item => item.branchId == res.branchId)
        this.itemsTypes.splice(index, 1);
        this.notifier.notify('success', 'تم الحذف بنجاح');
        this.updateTable();
      },
      err => {
        this.notifier.notify("error", err.message || 'حدث خطأ اثناء الحذف');
        const index = this.itemsTypes.findIndex(item => item.branchId == id);
        this.itemsTypes[index]['busy'] = false;
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

  ngOnInit() {}

}
