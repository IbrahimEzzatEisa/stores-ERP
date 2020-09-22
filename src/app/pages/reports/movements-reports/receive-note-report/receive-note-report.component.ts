import { Component, OnInit } from '@angular/core';
import { ReportsService } from 'src/app/shared/services';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-receive-note-report',
  templateUrl: './receive-note-report.component.html',
  styleUrls: ['./receive-note-report.component.css']
})
export class ReceiveNoteReportComponent implements OnInit {

  busyPrinting: boolean = false;

  txtFromDate: string;
  txtFromDateH: string;
  txtToDate: string;
  txtToDateH: string;

  constructor(private reportsService: ReportsService,
              private notifier: NotifierService) { }

  ngOnInit() {
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
    this.reportsService.getReceiveNoteReport({
      txtFromDate: this.txtFromDate,
      txtToDate: this.txtToDate
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
