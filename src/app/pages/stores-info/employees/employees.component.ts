import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';

import { Employee, AddEditTableColumn } from 'src/app/shared/models';
import { EmployeesService, BranchesService, PERMISSIONS } from 'src/app/shared/services';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  componentList: Employee[];
  busyCreating: boolean = false;
  busyPrinting: boolean = false;
  permissionId: number = PERMISSIONS.employees;
  branchesColumn: AddEditTableColumn;
  @ViewChild('table') table;
  pattern = new RegExp('[a-zA-Z, \u0600-\u06FF]+');

  constructor( 
    private componentService: EmployeesService,
    private branchesService: BranchesService,
    private spinner: NgxSpinnerService,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
    this.getBranches();
  }
 
  getBranches() {
    this.branchesService.getAll().subscribe(
      res => {
        let branchesColumn =  new AddEditTableColumn('الإدارة', 'branchId')
        branchesColumn.select = {
          valueKey: 'branchId',
          displayTextKey: 'branchName',
          list: res
        }
        this.branchesColumn = branchesColumn;
      }
    )
  }

  getAll() {
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

  //this get the emitted value from custom component and create new recored
  create(model: Employee) {
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
        this.notifier.notify('error', 'حدث خطأ اثناء الحفظ');
        this.busyCreating = false;
        this.updateTable();
      }
    );
  }

  update(model: Employee) {
    this.componentService.update(model.empId, model).subscribe(
      res => {
        const index = this.componentList.findIndex(item => item.empId==res.empId);
        this.componentList[index] = res;
        this.notifier.notify('success', 'تم التعديل بنجاح');
        this.table.refresh();
      },
      err => {
        const index = this.componentList.findIndex(item => item.empId==model.empId);
        this.componentList[index]['busy'] = false;
        this.notifier.notify('error', 'حدث خطأ اثناء التعديل');
        this.table.refresh();
      }
    );
  } 

  delete(id: number) {
    this.componentService.delete(id).subscribe(
      res => {
        const index = this.componentList.findIndex(item => item.empId == res.empId)
        this.componentList.splice(index, 1)
        this.notifier.notify('success', 'تم الحذف بنجاح');
        this.table.refresh();

      },
      err => {
        const index = this.componentList.findIndex(item => item.empId == id);
        this.componentList[index]['busy'] = false;
        this.notifier.notify('error', 'حدث خطأ اثناء الحذف');
        this.table.refresh();
      }
    )
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

  updateTable() {
    this.table.refresh();
  }
  
  canDeactivate() {
    return this.table.canDeactivate();
  }

}

