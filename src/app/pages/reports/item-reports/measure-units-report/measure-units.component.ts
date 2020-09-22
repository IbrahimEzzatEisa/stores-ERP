import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Unit } from 'src/app/shared/models';
import { UnitsService } from 'src/app/shared/services';
import { ReportsService } from 'src/app/shared/services/api/reports.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-measure-units',
  templateUrl: './measure-units.component.html',
  styleUrls: ['./measure-units.component.css']
})
export class MeasureUnitsComponent implements OnInit {
  
  fromUnit: number;
  toUnit: number;
  units:Unit[];
  dropdownsLoading: boolean = false;
  busyPrinting: boolean = false;

  constructor(
    private unitService:UnitsService,
    private reportsService: ReportsService,
    private notifier: NotifierService
  ) { }

  ngOnInit() 
  {
    this.listAllUnits();
  }

  listAllUnits(){
    this.dropdownsLoading = true;
    this.unitService.getAll().subscribe(
      (res:Unit[])=>{
        this.units=res;
        this.dropdownsLoading = false;
      }
    ), err => {
      console.log(err);
      this.dropdownsLoading = false;
    };
  }

  selectFromUnitId(unit) {
    this.fromUnit = unit.unitId;
  }

  selectToUnitId(unit) {
    this.toUnit = unit.unitId;
  }

  printReport() {
    if(this.fromUnit == undefined || this.toUnit == undefined) {
      this.notifier.notify('error', 'قم بإختيار الوحدات أولاً');
      return;
    }
    this.busyPrinting = true;
    this.reportsService.getMeasureUnitsReport(this.fromUnit, this.toUnit).subscribe((res) => {
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
