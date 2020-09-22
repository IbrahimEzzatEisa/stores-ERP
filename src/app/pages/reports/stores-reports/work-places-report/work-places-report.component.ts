import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';

import { WorkPlace } from 'src/app/shared/models';
import { WorkPlacesService, ReportsService } from 'src/app/shared/services';

@Component({
  selector: 'app-work-places-report',
  templateUrl: './work-places-report.component.html',
  styleUrls: ['./work-places-report.component.css']
})
export class WorkPlacesReportComponent implements OnInit {
  workplaces:WorkPlace[];
  busyPrinting: boolean = false;
  fromWorkPlaceId: number=null;
  toWorkPlaceId: number=null;
  busyLoadingWorkPlaces: boolean = false;

  constructor(
    private workplaceService:WorkPlacesService,
    private reportsService: ReportsService,
    private notifier: NotifierService,
  ) { }

  ngOnInit() {
    this.listAllWorkPlaces();
  }
  listAllWorkPlaces(){
    this.busyLoadingWorkPlaces=true;
    this.workplaceService.getAll().subscribe(
      (res:any)=>{
        this.workplaces=res.result;
        this.busyLoadingWorkPlaces=false;
      },err=>{
        this.busyLoadingWorkPlaces=false;
      }
    );
  }

  selectFromWorkplaceId(workplace){
    this.fromWorkPlaceId=workplace.workPlaceId;
  }
  selectToWorkplaceId(workplace){
this.toWorkPlaceId=workplace.workPlaceId;
  }
  printReport() {
    if (this.toWorkPlaceId == null || this.fromWorkPlaceId == null) {
      this.notifier.notify('error', 'قم  بملأ البيانات أولا ');
      return;
    }
    this.busyPrinting = true;
    this.reportsService.getWorkPlacesReport(this.fromWorkPlaceId, this.toWorkPlaceId).subscribe(
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
