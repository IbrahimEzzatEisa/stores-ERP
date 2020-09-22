import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';

import { SharedSettingsService, DateService } from 'src/app/shared/services';


@Component({
  selector: 'app-change-items-year',
  templateUrl: './change-items-year.component.html'
})
export class ChangeItemsYearComponent implements OnInit {

  itemsYear: number;
  yearsList: number[] = [];

  constructor(
    private notifier: NotifierService,
    private sharedSettingsService: SharedSettingsService,
    private dateService: DateService
    ) { }

  ngOnInit() {
    this.itemsYear = Number.parseInt(this.sharedSettingsService.getSessionYear());
    this.generateYearsList();
  }

  generateYearsList() {
    const currentYear = Number.parseInt(this.dateService.getCurrentHijriYear());
    const listLength = currentYear - Number.parseInt(this.itemsYear+'') + 5;
    let yearsList: number[] = [];
    for(let i = 0; i < listLength; i++) {
      yearsList.push(currentYear-i)
    }
    this.yearsList = yearsList;
  }

  save() {
    this.sharedSettingsService.setSessionYear(this.itemsYear+'');
    this.generateYearsList();
    this.notifier.notify('success', `تم تعيين "${this.itemsYear} هـ" سنة الأصناف`);
  }
  reset() {
    this.itemsYear = Number.parseInt(this.dateService.getCurrentHijriYear());
    this.save();
  }

}
