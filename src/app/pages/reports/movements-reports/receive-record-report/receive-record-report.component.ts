import { Component, OnInit } from '@angular/core';
import { EmployeesService, ReportsService } from 'src/app/shared/services';
import { Employee } from 'src/app/shared/models';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-receive-record-report',
  templateUrl: './receive-record-report.component.html',
  styleUrls: ['./receive-record-report.component.css']
})
export class ReceiveRecordReportComponent implements OnInit {

  employees: Employee[];
  busyLoadingEmployees:boolean = false;
  busyPrinting: boolean = false;

  txtFromDate: string;
  txtFromDateH: string;
  txtToDate: string;
  txtToDateH: string;
  txtRecipientId: number;

  constructor(private employeesService: EmployeesService,
              private reportsService: ReportsService,
              private notifier: NotifierService) { }

  ngOnInit() {
    this.listAllEmployees();
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
  selectFromDate(date) {
    this.txtFromDate = date.greg;
    this.txtFromDateH = date.hijri;
  }
  selectToDate(date) {
    this.txtToDate = date.greg;
    this.txtToDateH = date.hijri;
  }
  selectEmpId(emp) {
    this.txtRecipientId = emp.empId;
  }
  printReport() {
    this.busyPrinting = true;
    this.reportsService.getReceiveRecordReport({
      txtFromDate: this.txtFromDate,
      txtToDate: this.txtToDate,
      txtRecipientId: this.txtRecipientId
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
