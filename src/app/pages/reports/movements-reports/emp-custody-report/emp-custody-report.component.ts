import { Component, OnInit } from '@angular/core';
import { Item, Employee } from 'src/app/shared/models';
import { ItemsService, EmployeesService, ReportsService } from 'src/app/shared/services';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-emp-custody-report',
  templateUrl: './emp-custody-report.component.html',
  styleUrls: ['./emp-custody-report.component.css']
})
export class EmpCustodyReportComponent implements OnInit {

  items:Item[];
  employees:Employee[];
  busyLoadingItems: boolean = false;
  busyLoadingEmployees: boolean = false;
  busyPrinting: boolean = false;
  
  txtEmpId: number;
  txtItemFullCode: string;
  txtFromDate: string;
  txtFromDateH: string;
  txtToDate: string;
  txtToDateH: string;
  chkDetails: boolean = false;
  chkShowAll: boolean = false;

  constructor(
    private itemsService:ItemsService,
    private employeesService:EmployeesService,
    private reportsService: ReportsService,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
    this.listAllEmployees();
    this.listAllItems();
  }
  listAllItems(){
    this.busyLoadingItems = true;
    this.itemsService.getAll().subscribe(
      (res:any)=>{
        this.items=res.result;
        console.log(this.items)
        this.busyLoadingItems = false;
      }, err => {
        this.busyLoadingItems = false;
      }
    );
  }
  listAllEmployees(){
    this.busyLoadingEmployees = true;
    this.employeesService.getAll().subscribe(
      (res:Employee[])=>{
        this.employees=res;
        this.busyLoadingEmployees = false;
      }, err => {
        this.busyLoadingEmployees = false;
      }
    );
  }
  selectEmpId(emp) {
    this.txtEmpId = emp.empId;
  }
  selectItemFullCode(item) {
    this.txtItemFullCode = item.itemFullCode;
  }
  selectFromDate(date) {
    this.txtFromDate = date.greg;
    this.txtFromDateH = date.hijri;
  }
  selectToDate(date) {
    this.txtToDate = date.greg;
    this.txtToDateH = date.hijri;
  }
  printReport() {
    this.busyPrinting = true;
    this.reportsService.getEmpCustodyReport({
      txtEmpId: this.txtEmpId,
      txtItemFullCode: this.txtItemFullCode,
      txtFromDate: this.txtFromDate? this.txtFromDate: 'null',
      txtToDate: this.txtToDate? this.txtToDate: 'null',
      chkDetails: this.chkDetails,
      chkShowAll: this.chkShowAll
    }).subscribe(res => {
      if (res.pdfUrl) {
        window.open(res.pdfUrl, "_blank", 'location=yes,height=600,width=900,scrollbars=yes,status=yes');
        this.busyPrinting = false;
      }
    },
    err => {
      this.busyPrinting = false;
      let errorMessage = err.message || 'خطأ فى الحصول على ملف الطباعة';
      this.notifier.notify('error', errorMessage);
    })
  }

}
