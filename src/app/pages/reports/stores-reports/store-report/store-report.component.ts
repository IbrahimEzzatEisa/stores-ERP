import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';

import { Store } from 'src/app/shared/models';
import { StoresService, ReportsService } from 'src/app/shared/services';

@Component({
  selector: 'app-store-report',
  templateUrl: './store-report.component.html',
  styleUrls: ['./store-report.component.css']
})
export class StoreReportComponent implements OnInit {
  stores: Store[];
  busyPrinting: boolean = false;
  fromStoreId: number=null;
  toStoreId: number=null;
  busyLoadingStores: boolean = false;

  constructor(
    private storesServices: StoresService,
    private reportsService: ReportsService,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
    this.listAllStores();
  }
  listAllStores() {
    this.busyLoadingStores=true;
    this.storesServices.getAll().subscribe(
      (res: any) => {
        this.stores = res.result;
        this.busyLoadingStores=false;
      },
      err=>{
        this.busyLoadingStores=false;
      }
    );

  }
  selectToStoreId(toStore) {
    this.toStoreId= toStore.storeId;

  }
  selectFromStoreId(fromStore) {
    this.fromStoreId = fromStore.storeId;
  }
  printReport() {
    console.log("this.toStoreId",this.toStoreId);
    
    if (this.toStoreId == null || this.fromStoreId == null) {
      this.notifier.notify('error', 'قم  بملأ البيانات أولا ');
      return;
    }
    this.busyPrinting = true;
    this.reportsService.getStoresReport(this.fromStoreId, this.toStoreId).subscribe(
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
