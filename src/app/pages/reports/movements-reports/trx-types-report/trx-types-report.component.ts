import { Component, OnInit } from '@angular/core';
import { Supplier } from 'src/app/shared/models';
import { SuppliersService, ReportsService } from 'src/app/shared/services';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-trx-types-report',
  templateUrl: './trx-types-report.component.html',
  styleUrls: ['./trx-types-report.component.css']
})
export class TrxTypesReportComponent implements OnInit {

  trxTypes = [
    {trxId: 0, trxName: 0},
    {trxId: 3, trxName: 3},
    {trxId: 4, trxName: 4},
    {trxId: 5, trxName: 5},
    {trxId: 8, trxName: 8},
    {trxId: 106, trxName: 106},
    {trxId: 108, trxName: 108},
    {trxId: 116, trxName: 116}
  ]

  dropdownsLoading: boolean = false;
  busyPrinting: boolean = false;

  fromTrxTypeId: number = 0;
  toTrxTypeId: number = 0;

  constructor(
              private notifier: NotifierService,
              private reportsService: ReportsService
  ) { }

  ngOnInit() {
  }
  
  selectFromTrxTypeId(supplier) {
    this.fromTrxTypeId = supplier.supplierId;
  }
  selectToTrxTypeId(supplier) {
    this.toTrxTypeId = supplier.supplierId;
  }
  printReport() {
    if(this.fromTrxTypeId == undefined || this.toTrxTypeId == undefined) {
      this.notifier.notify('error', 'قم بإختيار الرموز أولاً');
      return;
    }
    this.busyPrinting = true;
    this.reportsService.getTrxTypesReport(this.fromTrxTypeId, this.toTrxTypeId).subscribe((res) => {
      if(res.pdfUrl) {
        window.open(res.pdfUrl, "_blank", 'location=yes,height=600,width=900,scrollbars=yes,status=yes');
        this.busyPrinting = false;
      }
    },
    err=>{
      this.busyPrinting = false;
      let errorMessage = err.message || 'خطأ فى الحصول على ملف الطباعة';
      this.notifier.notify('error', errorMessage);
      
    })
  }

}
