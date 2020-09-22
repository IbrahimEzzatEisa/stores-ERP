import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms'

import { SharedModule } from '../../shared/shared.module'
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import {
  MeasureUnitsComponent,
  ItemCardComponent,
  ItemsDataComponent,
  ReturnItemCardComponent,
  ReturnItemsDataReportComponent
 } from './item-reports';
import {
   StoreItemsBalanceReportComponent,
   StoreKeepersReportComponent,
   StoreReportComponent,
   WorkPlacesReportComponent
   } from './stores-reports';
import {
   SuppliersReportComponent,
   TrxTypesReportComponent,
   EmpCustodyReportComponent,
   ReceiveNoteReportComponent,
   ReceiveRecordReportComponent,
   ItemOutOrderReportComponent,
   TempReceiveNotificationReportComponent,
   TransferCustodyReportComponent,
   ReturnDocumentReportComponent,
   } from './movements-reports';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReportsRoutingModule,
    SharedModule,
  ],
  declarations: [
    ReportsComponent, 
    MeasureUnitsComponent, 
    ItemsDataComponent, 
    ReturnItemCardComponent, 
    ItemCardComponent, 
    ReturnItemsDataReportComponent, 
    StoreItemsBalanceReportComponent, 
    StoreKeepersReportComponent, 
    StoreReportComponent, 
    WorkPlacesReportComponent, 
    SuppliersReportComponent, 
    TrxTypesReportComponent, 
    EmpCustodyReportComponent, 
    ReceiveNoteReportComponent, 
    ReceiveRecordReportComponent, 
    ItemOutOrderReportComponent, 
    TempReceiveNotificationReportComponent, 
    TransferCustodyReportComponent, 
    ReturnDocumentReportComponent
  ]
})
export class ReportsModule { }
