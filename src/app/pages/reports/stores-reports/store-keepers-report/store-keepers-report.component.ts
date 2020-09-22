import { Component, OnInit } from '@angular/core';
import { StoreKeeper } from 'src/app/shared/models';
import { StoreKeepersService, ReportsService } from 'src/app/shared/services';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-store-keepers-report',
  templateUrl: './store-keepers-report.component.html',
  styleUrls: ['./store-keepers-report.component.css']
})
export class StoreKeepersReportComponent implements OnInit {
  storeKeepers: StoreKeeper[];
  busyPrinting: boolean = false;
  fromStoreKeeperId: number=null;
  toStoreKeeperId: number=null;
  busyLoadingStoreKeepers: boolean = false;

  constructor(
    private storeKeepersService: StoreKeepersService,
    private reportsService: ReportsService,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
    this.listAllStoresKeepers();
  }

  listAllStoresKeepers() {
    this.busyLoadingStoreKeepers = true;
    this.storeKeepersService.getAll().subscribe(
      (res: StoreKeeper[]) => {
        this.storeKeepers = res;
        this.busyLoadingStoreKeepers = false;
      },
      err => {
        this.busyLoadingStoreKeepers = false;
      }
    );
  }
  selectToStoreKeeperId(toStoreKeeper) {
    this.toStoreKeeperId = toStoreKeeper.storeKeeperId;

  }
  selectFromStoreKeeperId(fromStoreKeeper) {
    this.fromStoreKeeperId = fromStoreKeeper.storeKeeperId;
  }
  printReport() {
    if (this.toStoreKeeperId == null || this.fromStoreKeeperId == null) {
      this.notifier.notify('error', 'قم  بملأ البيانات اولا ');
      return;
    }
    this.busyPrinting = true;
    this.reportsService.getStoreKeepersReport(this.fromStoreKeeperId, this.toStoreKeeperId).subscribe(
      res => {
        if (res.pdfUrl) {
          window.open(res.pdfUrl, "_blank", 'location=yes,height=600,width=900,scrollbars=yes,status=yes');
          this.busyPrinting = false;
        }
      },
       err => { 
        this.busyPrinting = false;
        let errorMessage = err.message || 'خطأ فى الحصول على ملف الطباعة';
        this.notifier.notify('error', errorMessage);
       }
    );


  }

}
