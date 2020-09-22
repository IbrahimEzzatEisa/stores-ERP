import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';

import { Setting } from '../../../shared/models';
import { SettingsService } from '../../../shared/services/api/settings.service';
import { SharedSettingsService } from 'src/app/shared/services'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  settingList=new Setting();
  busySaving;

  constructor(
    private componentService:SettingsService,
    private sharedSettingsService: SharedSettingsService,
    private notifier: NotifierService,
    private spinner: NgxSpinnerService,

  ) { }

  ngOnInit() {
    this.getAll();
  }

getAll(){
  this.spinner.show();
    this.componentService.get().subscribe(
    (res:Setting)=>{
      this.settingList = res;
      this.spinner.hide();
    },
    err=>{
      this.spinner.hide();

    }
  );

  }
  saveChanges(modal:Setting){
    this.busySaving = true;
    this.componentService.update(modal).subscribe(
       res=>{
         this.busySaving = false;
         this.notifier.notify('success', 'تم الحفظ بنجاح');
        this.sharedSettingsService.refreshAppSettings();
  },
       err=>{
         this.busySaving = false;
         this.notifier.notify("error", err.message || 'حدث خطأ اثناء الحفظ');
  }
);

  }
}
