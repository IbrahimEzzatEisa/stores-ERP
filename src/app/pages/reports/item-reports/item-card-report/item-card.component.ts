import { Component, OnInit } from '@angular/core';

import { ItemGroup, Item } from 'src/app/shared/models';
import { ItemGroupsService, ItemsService, SharedSettingsService, ReportsService } from 'src/app/shared/services';
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.css']
})
export class ItemCardComponent implements OnInit {

  groups:ItemGroup[];
  fromItems:Item[];
  toItems:Item[];
  busyLoadingItemGroups: boolean = false;
  busyLoadingFromItems: boolean = false;
  busyLoadingToItems: boolean = false;
  busyPrinting: boolean = false;

  itemYear: number;
  fromItemGroupID: string = 'null';
  fromItemID: string = 'null';
  toItemGroupID: string = 'null';
  toItemID: string = 'null';
  fromDate;
  fromDateH;
  toDate;
  toDateH;
  optItemCard2: boolean = false;
  optItemCard;

  constructor(
    private itemGroupService:ItemGroupsService,
    private itemsService:ItemsService,
    private sharedSettingService: SharedSettingsService,
    private reportsService: ReportsService,
    private notifier: NotifierService

  ) { }

  ngOnInit() {
    this.listAllItemsGroups();
    this.getItemYear();
  }
  listAllItemsGroups(){
    this.busyLoadingItemGroups = true;
    this.itemGroupService.getAll().subscribe(
      (res:ItemGroup[])=>{
        this.groups=res;
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
  selectFromDate(date) {
    this.fromDate = date.greg;
    this.fromDateH = date.hijri;
    // let datt = new Date(date.greg);
     /*.toISOString().split('T')[0];*/
    // this.fromDate = datt.valueOf();
  }
  selectToDate(date) {
    this.toDate = date.greg;
    this.toDateH = date.hijri;
    // let datt = new Date(date.greg);
     /*.toISOString().split('T')[0]*/
    // this.toDate = datt.valueOf();
  }
  selectFromItemGroupId(group) {
    this.fromItemGroupID = group.itemGroupId;
    this.fromItemID = 'null';
    this.fromItems = [];
    this.getDropDownFromItems();
  }
  selectFromItemId(item) {
    this.fromItemID = item.itemId;
  }
  selectToItemGroupId(group) {
    this.toItemGroupID = group.itemGroupId;
    this.toItemID = 'null';
    this.toItems = [];
    this.getDropDownToItems();
  }
  selectToItemId(item) {
    this.toItemID = item.itemId;
  }
  printReport() {
    this.busyPrinting = true;
    this.reportsService.getItemCardReport({
      itemYear:this.itemYear,
      txtFromItemGroupId:this.fromItemGroupID,
      txtToItemGroupId:this.toItemGroupID,
      txtFromItemId:this.fromItemID,
      txtToItemId:this.toItemID,
      txtFromDate:this.fromDate? this.fromDate : 'null',
      txtToDate:this.toDate? this.toDate : 'null',
      optItemCard2:this.optItemCard2
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

