import { Component, OnInit } from '@angular/core';

import { ItemGroup } from 'src/app/shared/models';
import { ItemGroupsService, SharedSettingsService, ReportsService } from 'src/app/shared/services';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-items-data',
  templateUrl: './items-data.component.html',
  styleUrls: ['./items-data.component.css']
})
export class ItemsDataComponent implements OnInit {
  
  dropdownsLoading: boolean = false;
  busyPrinting: boolean = false;
  groups:ItemGroup[];

  itemYear: number;
  rdAll: boolean = true;
  rdGrouped: boolean = false;
  chkAddEmptyColumn: boolean = false;
  itemGroupId: string = 'null';
  chkHasBalance: boolean = false;

  constructor(
    private itemGroupService: ItemGroupsService,
    private sharedSettingsService: SharedSettingsService,
    private reportsService: ReportsService,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
    this.listAllItemsGroups();
    this.getItemYear();
  }
  listAllItemsGroups(){
    this.dropdownsLoading = true;
    this.itemGroupService.getAll().subscribe(
      (res:ItemGroup[])=>{
        this.groups=res;
        this.dropdownsLoading = false;
      }, err => {
        console.log(err);
        this.dropdownsLoading = false;
      }
    );
  }
  getItemYear() {
    this.itemYear = parseInt(this.sharedSettingsService.getSessionYear());
  }
  selectItemGroupId(group) {
    this.itemGroupId = group.itemGroupId;
  }
  checkRdAll() {
    if (this.rdAll == false) {
      this.rdAll = true;
      this.rdGrouped = false;
    } else {
      this.rdAll = false;
      this.rdGrouped = true;
    }
  }
  checkRdGrouped() {
    if (this.rdGrouped == false) {
      this.rdGrouped = true;
      this.rdAll = false;
    } else {
      this.rdGrouped = false;
      this.rdAll = true;
    }
  }
  printReport() {
    if(this.itemGroupId == undefined) {
      this.notifier.notify('error', 'قم بإختيار الوحدات أولاً');
      return;
    }
    this.busyPrinting = true;
    this.reportsService.getItemDataReport({
      itemYear: this.itemYear,
      rdAdll: this.rdAll,
      rdGrouped: this.rdGrouped,
      chkAddEmptyColumn: this.chkAddEmptyColumn,
      itemGroupId: this.itemGroupId,
      chkHasBalance: this.chkHasBalance
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
