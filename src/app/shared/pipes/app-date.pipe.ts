import { Pipe, PipeTransform } from '@angular/core';

import { SharedSettingsService, DateService } from 'src/app/shared/services';

@Pipe({
    name: 'appDate'
})
export class AppDatePipe implements PipeTransform {
    
    constructor(
        private sharedSettingsService: SharedSettingsService,
        private dateService: DateService
    ){}

    transform(date: string | Date): string {
        date = new Date(date);
        let isHijri = true;
        this.sharedSettingsService.getSettings().subscribe(
            appSettings => {
                if(appSettings && appSettings.systemDate) {
                    appSettings.systemDate == "UmAlQura" ? isHijri = true : isHijri = false
                }
            }
        );
        if(isHijri) {
            return this.dateService.fromGregorianToUmmulquraString(date) + ' هـ';
        } else {
            return this.dateService.fromGregorianToGregorianString(date) + ' م';
        }
    }
}