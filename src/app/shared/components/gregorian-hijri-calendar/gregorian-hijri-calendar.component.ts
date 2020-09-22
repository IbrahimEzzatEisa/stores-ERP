import { 
  Component, OnInit, ElementRef, 
  HostListener, ViewChild, Input, Output, EventEmitter 
} from '@angular/core';
declare var require: any;
// const hijriSafe = require('hijri-date/lib/safe');
// const HijriDate =  hijriSafe.default;
require('./jquery.calendars');
require('./jquery.calendars.plus');
require('./jquery.calendars.ummalqura');
require('./jquery.calendars.ummalqura-ar');
declare var $: any;

import { UQCal, monthStringer, Hijri } from './date';
const ESCAPE_KEYCODE = 27;

import { SharedSettingsService } from '../../services';

@Component({
  selector: 'gregorian-hijri-calendar',
  templateUrl: './gregorian-hijri-calendar.component.html',
  styleUrls: ['./gregorian-hijri-calendar.component.css'],
  host: {
    '(document:click)': 'handleClick($event)',
  },
})

export class GregorianHijriCalendarComponent implements OnInit {

  currentPage;
  currentPageH;
  calenderData;
  calenderDataH;
  monthStringer;
  calenderVisibleG;
  calenderVisibleH
  selectedDay;
  selectedDayH;
  selectedDayG;
  isHijri;
  @ViewChild('calenderInputH') calenderInputH: ElementRef;
  @ViewChild('calenderInputG') calenderInputG: ElementRef;
  @ViewChild('calenderH') calenderH: ElementRef;
  @ViewChild('calenderG') calenderG: ElementRef;
  @ViewChild('calenderIconG') calenderIconG: ElementRef;
  @ViewChild('calenderIconH') calenderIconH: ElementRef;
  @Input() gDate;
  @Input() disabled;
  @Input() isRequired: boolean;
  isDirty: boolean = false;
  @Output() onSelect = new EventEmitter();

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === ESCAPE_KEYCODE) {
      this.hideAllCalenders();
    }
  }

  get invalid(): boolean {
    return this.isRequired && !this.selectedDay;
  }

  constructor(
    private _eref: ElementRef,
    private sharedSettingsService: SharedSettingsService
  ) {
    this.monthStringer = monthStringer;
  }

  handleClick(event) {
    if(this.calenderInputH && event.target != this.calenderIconH.nativeElement && event.target != this.calenderInputH.nativeElement && !this.isParent(event.target, this.calenderH.nativeElement)) {
      this.hideCalenderH();
    }
    if(this.calenderInputG && event.target != this.calenderIconG.nativeElement && event.target != this.calenderInputG.nativeElement && !this.isParent(event.target, this.calenderG.nativeElement)) {
      this.hideCalenderG();
    }
  }
  isParent(element, parentElement) {
    if(element == parentElement)
      return true;
    while(element.parentNode) {
      if(element.parentNode==parentElement) {
        return true;
      } else {
        element = element.parentNode
      }
    }
    return false;
  }
  showCalenderG() {
    if(this.disabled)
      return;
    this.getSelectedDay();
    this.calenderVisibleG = true;
  }
  showCalenderH() {
    if(this.disabled)
      return;
    this.getSelectedDay();
    this.calenderVisibleH = true;
  }
  hideCalenderG() {
    if(!this.calenderVisibleG) return;
    this.calenderVisibleG = false;
    this.isDirty = true;
  }
  hideCalenderH() {
    if(!this.calenderVisibleH) return;
    this.calenderVisibleH = false;
    this.isDirty = true;
  }
  hideAllCalenders() {
    this.hideCalenderH();
    this.hideCalenderG();
  }
  toggleCalenderG() {
    this.calenderVisibleG = !this.calenderVisibleG;
  }
  toggleCalenderH() {
    this.calenderVisibleH = !this.calenderVisibleH;
  }
  selectDay(day, dontEmit?){
    this.selectedDay = day;
    this.selectedDayH = this.dayToInputString('h');
    this.selectedDayG = this.dayToInputString('g');
    if(!dontEmit)
      this.onSelect.emit(this.dateToDBFormat(day));
    this.hideAllCalenders();
  }
  dayToInputString = function(type = '') {
    let d = this.selectedDay;
    if(!d) return '';
    if(type.toLowerCase()==='h') 
      return d.Hyear+'/'+d.Hmonth+'/'+d.Hday+' هـ';
    if(type.toLowerCase()==='g')
      return d.Gyear+'/'+d.Gmonth+'/'+d.Gday+' م';
    return d.Hyear+'/'+d.Hmonth+'/'+d.Hday+'هـ - '+d.Gyear+'/'+d.Gmonth+'/'+d.Gday+' م';
}
  getSelectedDay() {
    if(!this.selectedDay) return;
    this.makeDaysCalenderDateG(this.selectedDay.Gmonth-1, this.selectedDay.Gyear);
    this.makeDaysCalenderDateH(this.selectedDay.Hmonth, this.selectedDay.Hyear);
  }
  getTodayH() {
    let calendar = $.calendars.instance("gregorian");
    let date = calendar.parseDate('yyyy/mm/dd', 
      new Date().getFullYear() + '/' + (new Date().getMonth()+1) + '/' + new Date().getDate());
    calendar = $.calendars.instance("ummalqura");
    date = calendar.fromJD(date.toJD());
    let month = date._month;
    let year = date._year;
    this.makeDaysCalenderDateH(month, year);
  }
  getToday() {
    let month = new Date().getMonth();
    let year = new Date().getFullYear();
    this.makeDaysCalenderDateG(month, year);
  }
  getNextMonthH() {
    let month = this.currentPageH.Hmonth+1;
    let year = this.currentPageH.Hyear;
    if(month>12) {
      month = 1;
      year++; 
    }
    this.makeDaysCalenderDateH(month, year);
  }
  getNextMonth() {
    let month = this.currentPage.Gmonth+1;
    let year = this.currentPage.Gyear;
    if(month>11) {
      month = 0;
      year++; 
    }
    this.makeDaysCalenderDateG(month, year);
  }
  getPreviousMonthH() {
    let month = this.currentPageH.Hmonth-1;
    let year = this.currentPageH.Hyear;
    if(month<1) {
      month = 12;
      year--;
    }
    this.makeDaysCalenderDateH(month, year);
  }
  getPreviousMonth() {
    let month = this.currentPage.Gmonth-1;
    let year = this.currentPage.Gyear;
    if(month<0) {
      month = 11;
      year--;
    }
    this.makeDaysCalenderDateG(month, year);
  }
  makeDaysCalenderDateH(month, year) {
    var _self = this;
    var pageMonth = month;
    var pageYear = year;
    //////////////
    // var firstDay = new HijriDate(year, month, 1);
    // let day = firstDay.toGregorian();
    var calendar = $.calendars.instance("ummalqura");
    var date = calendar.parseDate('yyyy/mm/dd', year +'/'+ month + '/' + 1);
    calendar = $.calendars.instance("gregorian");
    let day = calendar.fromJD(date.toJD());
    let datDate = new Date(day._year, day._month-1, day._day);
    let startingOffset = datDate.getDay()+1;
    let startGYear = datDate.getFullYear();
    let startGMonth = datDate.getMonth();
    let startGDate = datDate.getDate();
    let uqDate = new UQCal(datDate).convert();
    let numberOfDaysOfMonth = uqDate.Hlength;
    let calenderDataLength = 35;
    if (numberOfDaysOfMonth + startingOffset > calenderDataLength) {
        calenderDataLength = 42;
    }
    let calenderData = new Array(calenderDataLength);
    calenderData.fill(false, 0, calenderDataLength);
    for (var i = 0; i < numberOfDaysOfMonth; i++) {
      calenderData[i+startingOffset] = {
        UQDate: new UQCal(new Date(startGYear, startGMonth, startGDate + i)).convert(),
        active: false,
        today: new Date().toString().slice(0, 15) == new Date(startGYear, startGMonth, startGDate + i).toString().slice(0, 15)
      }
    }
    _self.currentPageH = {
      Hmonth: pageMonth,
      Hyear: pageYear,
      GmonthStart: calenderData[startingOffset].UQDate.Gmonth,
      GyearStart: calenderData[startingOffset].UQDate.Gyear,
      GmonthEnd: calenderData[startingOffset+numberOfDaysOfMonth-1].UQDate.Gmonth,
      GyearEnd: calenderData[startingOffset+numberOfDaysOfMonth-1].UQDate.Gyear
    };
    // console.log("_self.currentPageH", _self.currentPageH);
    _self.calenderDataH = calenderData;
    // console.log("_self.calenderDataH", _self.calenderDataH);
  }
  makeDaysCalenderDateG(month, year) {
    var _self = this;
    var pageMonth = month;
    var pageYear = year;
    var dayPerMonth = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    dayPerMonth[1] = 28;
    if ((pageYear % 100 != 0) && (pageYear % 4 == 0) || (pageYear % 400 == 0)) {
        dayPerMonth[1] = 29;
    }
    var firstDay = new Date(pageYear, pageMonth, 1);
    var numberOfDaysOfMonth = dayPerMonth[pageMonth];
    var startingOffset = firstDay.getDay()+1;
    var calenderDataLength = 35;
    if (numberOfDaysOfMonth + startingOffset > calenderDataLength) {
        calenderDataLength = 42;
    }
    var calenderData = new Array(calenderDataLength);
    calenderData.fill(false, 0, calenderDataLength);
    for (var i = 0; i < numberOfDaysOfMonth; i++) {
        calenderData[i + startingOffset] = {
          UQDate: new UQCal(new Date(pageYear, pageMonth, i + 1)).convert(),
          active: false,
          today: new Date().toString().slice(0, 15) == new Date(pageYear, pageMonth, i + 1).toString().slice(0, 15)
        }
    }
    _self.currentPage = {
      Gmonth: pageMonth,
      Gyear: pageYear,
      HmonthStart: calenderData[startingOffset].UQDate.Hmonth,
      HyearStart: calenderData[startingOffset].UQDate.Hyear,
      HmonthEnd: calenderData[startingOffset+numberOfDaysOfMonth-1].UQDate.Hmonth,
      HyearEnd: calenderData[startingOffset+numberOfDaysOfMonth-1].UQDate.Hyear
    };
    // console.log("_self.currentPage", _self.currentPage);
    _self.calenderData = calenderData;
    // console.log("_self.calenderData", _self.calenderData);
  };
  clearSelection() {
    this.resetSelection();
    this.selectDay(null);
  }
  resetSelection() {
    this.selectedDay = null;
    this.selectedDayH = this.dayToInputString('h');
    this.selectedDayG = this.dayToInputString('g');
  }
  dateToDBFormat(date) {
    var dbFormat;
    if(!date) {
      dbFormat = {
        greg: null,
        hijri: null
      } 
    } else {
      dbFormat = {
        greg: `${date.Gyear}/${date.Gmonth}/${date.Gday}`,
        hijri: `${date.Hyear}/${date.Hmonth}/${date.Hday}`
      } 
    }
    return dbFormat;
  }
  DBFormatToUQDate(date) {
    date = new Date(date);
    date = new UQCal(date);
    date.convert();
    return date;
  }
  ngOnInit() {
    this.disabled = this.disabled || false;
    this.calenderVisibleH = false;
    this.calenderVisibleG = false;
    this.sharedSettingsService.getSettings().subscribe(
      appSettings => (appSettings.systemDate == "UmAlQura") ? this.isHijri = true : this.isHijri = false
    );
  }
  areEqual(d1, d2){
    d1.currentValue.valueOf()== d2.previousValue.valueOf()
  }
  ngOnChanges(change) {
    if(!change.gDate) return;
    if(change.gDate.currentValue && new Date(change.gDate.currentValue).toString()!='Invalid Date') {
      if(change.gDate.currentValue.valueOf() == new Date(change.gDate.previousValue).valueOf())
        return;
      this.gDate = new Date(change.gDate.currentValue);
      this.selectDay(this.DBFormatToUQDate(this.gDate), true);
      this.getSelectedDay();
    } else {
      this.resetSelection();
      this.getToday();
      this.getTodayH();
    }
  }
  reset() {
    setTimeout(() => {
      this.isDirty = false;
    }, 10);
  }

}
