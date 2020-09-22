import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';


import { ItemState } from '../../../shared/models';
import { ItemStatesService } from '../../../shared/services/api/item-states.service';
import { PERMISSIONS } from 'src/app/shared/services';

@Component({
  selector: 'app-item-states',
  templateUrl: './item-states.component.html',
  styleUrls: ['./item-states.component.css']
})
export class ItemStatesComponent implements OnInit {

  itemsTypes: ItemState[];
  busyCreating: boolean = false;
  busyPrinting: boolean = false;
  @ViewChild('table') table;

  permissionId: number = PERMISSIONS.itemStates;

  constructor(
    private componentService: ItemStatesService,
    private spinner: NgxSpinnerService,
    private notifier: NotifierService
    ) { }
  
  ngOnInit() {
  }
 
  getAll(){
    this.spinner.show();
    this.componentService.getAll().subscribe(
      res => {
        this.itemsTypes = res;
        this.spinner.hide();
      },
      err=>{
        this.spinner.hide();
      }
    );

  }
  create(model: ItemState) {
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

  update(model: ItemState) {
    this.componentService.update(model.itemStateId, model).subscribe(
      res => {
        const index = this.itemsTypes.findIndex(item => item.itemStateId==res.itemStateId);
        this.itemsTypes[index] = res;
        this.notifier.notify('success', 'تم التعديل بنجاح');
        this.updateTable();
      },
      err => {
        const index = this.itemsTypes.findIndex(item => item.itemStateId==model.itemStateId);
        this.itemsTypes[index]['busy'] = false;
        this.notifier.notify('error', err.message || 'حدث خطأ اثناء التعديل');
        this.updateTable();
      }
    );
  }

  delete(id: number) {
    this.componentService.delete(id).subscribe(
      res => {
        const index = this.itemsTypes.findIndex(item => item.itemStateId == res.itemStateId)
        this.itemsTypes.splice(index, 1)
        this.notifier.notify('success', 'تم الحذف بنجاح');
        this.updateTable();
      },
      err => {
        const index = this.itemsTypes.findIndex(item => item.itemStateId == id);
        this.itemsTypes[index]['busy'] = false;
        this.notifier.notify('error', err.message || 'حدث خطأ اثناء الحذف');
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

}
