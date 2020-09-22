import { Component, OnInit } from '@angular/core';
import { EmployeesService, ReportsService, SharedSettingsService } from 'src/app/shared/services';
import { Employee } from 'src/app/shared/models';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-item-out-order-report',
  templateUrl: './item-out-order-report.component.html',
  styleUrls: ['./item-out-order-report.component.css']
})
export class ItemOutOrderReportComponent implements OnInit {

  employees: Employee[];
  busyLoadingEmployees:boolean = false;
  busyPrinting: boolean = false;

  itemYear: number;
  txtFromDate: string;
  txtFromDateH: string;
  txtToDate: string;
  txtToDateH: string;
  txtDeliveryPersonId: number;

  constructor(private employeesService: EmployeesService,
              private reportsService: ReportsService,
              private sharedSettingService: SharedSettingsService,
              private notifier: NotifierService) { }

  ngOnInit() {
    this.listAllEmployees();
    this.getItemYear();
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
  getItemYear() {
    this.itemYear = parseInt(this.sharedSettingService.getSessionYear());
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
    this.txtDeliveryPersonId = emp.empId;
  }
  printReport() {
    this.busyPrinting = true;
    this.reportsService.getItemOutOrderReport({
      itemYear: this.itemYear,
      txtFromDate: this.txtFromDate,
      txtToDate: this.txtToDate,
      txtDeliveryPersonId: this.txtDeliveryPersonId
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
