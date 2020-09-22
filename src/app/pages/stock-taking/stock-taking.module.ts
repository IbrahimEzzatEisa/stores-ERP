import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module'
import { StockTakingRoutingModule } from './stock-taking-routing.module';
import { StockTakingComponent } from './stock-taking.component';
import { StockTakingTrxesAddEditComponent } from './stock-taking-trxes/stock-taking-trxes-add-edit/stock-taking-trxes-add-edit.component';
import { StockTakingTrxesListComponent } from './stock-taking-trxes/stock-taking-trxes-list/stock-taking-trxes-list.component';
import { StockTakingTrxesItemsComponent } from './stock-taking-trxes/stock-taking-trxes-items/stock-taking-trxes-items.component';
import { StockTakingTrxesEmployeesComponent } from './stock-taking-trxes/stock-taking-trxes-employees/stock-taking-trxes-employees.component';
import { DamagedSettlementAddEditComponent } from './damaged-settlement/damaged-settlement-add-edit/damaged-settlement-add-edit.component';
import { DamagedSettlementListComponent } from './damaged-settlement/damaged-settlement-list/damaged-settlement-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    StockTakingRoutingModule,
    SharedModule
  ],
  declarations: [
    StockTakingComponent, 
    StockTakingTrxesAddEditComponent, 
    StockTakingTrxesListComponent, 
    StockTakingTrxesItemsComponent,
    StockTakingTrxesEmployeesComponent,
    DamagedSettlementAddEditComponent,
    DamagedSettlementListComponent
  ]
})
export class StockTakingModule { }
