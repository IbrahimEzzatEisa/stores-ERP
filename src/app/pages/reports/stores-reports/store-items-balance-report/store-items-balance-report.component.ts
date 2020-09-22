import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';

import { ItemGroup, Store } from 'src/app/shared/models';
import {
  ItemGroupsService,
  StoresService,
  ReportsService
} from 'src/app/shared/services';

@Component({
  selector: 'app-store-items-balance-report',
  templateUrl: './store-items-balance-report.component.html',
  styleUrls: ['./store-items-balance-report.component.css']
})
export class StoreItemsBalanceReportComponent implements OnInit {
  groups: ItemGroup[];
  stores: Store[];
  txtItemGroupId: string = null;
  txtStoreId: number = null;
  txtDate: string = null;
  busyPrinting: boolean = false;
  busyLoadingItemGroups: boolean = false;
  busyLoadingStores: boolean = false;

  constructor(
    private itemGroupService: ItemGroupsService,
    private storesServices: StoresService,
    private reportsService: ReportsService,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
    this.listAllItemsGroups();
    this.listAllStores();
  }
  listAllItemsGroups() {
    this.busyLoadingItemGroups = true;
    this.itemGroupService.getAll().subscribe(
      (res: ItemGroup[]) => {
        this.groups = res;
        this.busyLoadingItemGroups = false;
      }, err => {
        this.busyLoadingItemGroups = false;

      }
    );
  }
  listAllStores() {
    this.busyLoadingStores = true;
    this.storesServices.getAll().subscribe(
      (res: any) => {
        this.stores = res.result;
        this.busyLoadingStores = false;
      },
      err => {
        this.busyLoadingStores = false;
      }
    );

  }
  selectInDate(date) {
    this.txtDate = date.greg;
  }
  selectItemGroupId(group) {
    this.txtItemGroupId = group.itemGroupId;
  }
  selectStoreId(store) {
    this.txtStoreId = store.storeId;
  }
  printReport() {
    if (this.txtDate == null || this.txtItemGroupId == null || this.txtStoreId == null) {
      this.notifier.notify('error', 'قم  بملأ البيانات اولا ');
      return;
    }
    this.busyPrinting = true;
    this.reportsService.getStoreItemsBalanceReport({
      txtDate: this.txtDate,
      txtStoreId: this.txtStoreId,
      txtItemGroupId: this.txtItemGroupId,
      itemYear: null
    }).subscribe((res) => {
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
