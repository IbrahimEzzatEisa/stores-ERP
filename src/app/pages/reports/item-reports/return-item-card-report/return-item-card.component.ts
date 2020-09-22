import { Component, OnInit } from '@angular/core';
import { Item, ItemGroup } from 'src/app/shared/models';
import { ItemsService, SharedSettingsService, ReportsService, ItemGroupsService } from 'src/app/shared/services';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-return-item-card',
  templateUrl: './return-item-card.component.html',
  styleUrls: ['./return-item-card.component.css']
})
export class ReturnItemCardComponent implements OnInit {

  groups: ItemGroup[];
  fromItems:Item[];
  toItems:Item[];

  busyLoadingItemGroups: boolean = false;
  busyLoadingFromItems: boolean = false;
  busyLoadingToItems: boolean = false;
  busyPrinting: boolean = false;

  itemYear: number;
  fromItemGroupID: string = 'null';
  fromTtemFullCode: string = 'null';
  toItemGroupID: string = 'null';
  toItemFullCode: string = 'null';
  fromDate;
  fromDateH;
  toDate;
  toDateH;

  constructor(
    private notifier: NotifierService,
    private itemsService:ItemsService,
    private itemGroupService: ItemGroupsService,
    private sharedSettingService: SharedSettingsService,
    private reportsService: ReportsService
  ) { }

  ngOnInit() {
    this.listAllItemsGroups();
    this.getItemYear();
  }
  listAllItemsGroups(){
    this.busyLoadingItemGroups = true;
    this.itemGroupService.getAll().subscribe(
      (res:ItemGroup[])=>{
        this.groups = res;
        this.busyLoadingItemGroups = false;
      }, err => {
        this.busyLoadingItemGroups = false;
      }
    );
  }
  getItemYear() {
    this.itemYear = parseInt(this.sharedSettingService.getSessionYear());
  }
  getDropDownFromItems() {
    this.busyLoadingFromItems = true;
    this.itemsService.getByItemsGroupId(this.fromItemGroupID, this.itemYear).subscribe(
      res => {
        this.fromItems = res;
        this.busyLoadingFromItems = false;
        console.log(this.fromItems)
      },
      err => {
        this.busyLoadingFromItems = false;
      }
    );
  }
  getDropDownToItems() {
    this.busyLoadingToItems = true;
    this.itemsService.getByItemsGroupId(this.toItemGroupID, this.itemYear).subscribe(
      res => {
        this.toItems = res;
        this.busyLoadingToItems = false;
      },
      err => {
        this.busyLoadingToItems = false;
      }
    );
  }
  selectFromItemGroupId(group) {
    this.fromItemGroupID = group.itemGroupId;
    this.fromTtemFullCode = 'null';
    this.fromItems = [];
    this.getDropDownFromItems();
  }
  selectFromItemFullCode(item) {
    this.fromTtemFullCode = item.itemFullCode;
  }
  selectToItemGroupId(group) {
    this.toItemGroupID = group.itemGroupId;
    this.toItemFullCode = 'null';
    this.toItems = [];
    this.getDropDownToItems();
  }
  selectToItemFullCode(item) {
    this.toItemFullCode = item.itemFullCode;
  }
  selectFromDate(date) {
    this.fromDate = date.greg;
    this.fromDateH = date.hijri;
  }
  selectToDate(date) {
    this.toDate = date.greg;
    this.toDateH = date.hijri;
  }
  printReport() {
    this.busyPrinting = true;
    this.reportsService.getItemCardCReport({
      itemYear: this.itemYear,
      txtFromItemFullCode: this.fromTtemFullCode? this.fromTtemFullCode : 'null',
      txtToItemFullCode: this.toItemFullCode? this.toItemFullCode : 'null',
      txtFromDate:this.fromDate? this.fromDate : 'null',
      txtToDate:this.toDate? this.toDate : 'null',
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
