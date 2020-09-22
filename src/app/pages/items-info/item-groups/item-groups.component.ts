import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';


import { ItemGroup } from '../../../shared/models';
import { ItemGroupsService, PERMISSIONS } from '../../../shared/services';

@Component({
  selector: 'app-item-groups',
  templateUrl: './item-groups.component.html',
  styleUrls: ['./item-groups.component.css']
})
export class ItemGroupsComponent implements OnInit {
  
  itemsTypes: ItemGroup[];
  busyCreating: boolean = false;
  busyPrinting: boolean = false;
  permissionId: number = PERMISSIONS.itemGroups;
  @ViewChild('table') table;

  constructor(
    private componentService:ItemGroupsService,
    private spinner: NgxSpinnerService,
    private notifier: NotifierService
    ) { }
  ngOnInit() {
  }
 
  getAll(){
    this.spinner.show();
    this.componentService.getAll().subscribe(
    (res:ItemGroup[])=>{
      this.itemsTypes = res;
      console.log(res)
      this.spinner.hide();
    },
    err=>{
      this.spinner.hide();
    }
  );

  }
  create(model: ItemGroup) {
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

  update(model: ItemGroup) {
    this.componentService.update(model.itemGroupId, model).subscribe(
      res => {
        const index = this.itemsTypes.findIndex(item => item.itemGroupId==res.itemGroupId);
        this.itemsTypes[index] = res;
        this.notifier.notify('success', 'تم التعديل بنجاح');
        this.updateTable();
      },
      err => {
        const index = this.itemsTypes.findIndex(item => item.itemGroupId==model.itemGroupId);
        this.itemsTypes[index]['busy'] = false;
        this.notifier.notify('error', err.message || 'حدث خطأ اثناء التعديل');
        this.updateTable();
      }
    );
  }

  delete(id: number) {
    this.componentService.delete(id).subscribe(
      res => {
        const index = this.itemsTypes.findIndex(item => item.itemGroupId == res.itemGroupId)
        this.itemsTypes.splice(index, 1)
        this.notifier.notify('success', 'تم الحذف بنجاح');
        this.updateTable();
      },
      err => {
        const index = this.itemsTypes.findIndex(item => item.itemGroupId == id);
        this.itemsTypes[index]['busy'] = false;
        this.notifier.notify('error', err.message || 'حدث خطأ اثناء الحذف');
        this.updateTable();
      }
    )
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
 
  updateTable() {
    this.table.refresh();
  }

  canDeactivate() {
    return this.table.canDeactivate();
  }

}
