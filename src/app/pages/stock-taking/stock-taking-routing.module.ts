import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockTakingComponent } from './stock-taking.component';
import { StockTakingTrxesAddEditComponent } from './stock-taking-trxes/stock-taking-trxes-add-edit/stock-taking-trxes-add-edit.component';
import { StockTakingTrxesListComponent } from './stock-taking-trxes/stock-taking-trxes-list/stock-taking-trxes-list.component';
import { PermissionGuard, PERMISSIONS } from 'src/app/shared/services';
import { permissionsTypes } from 'src/app/shared/enums';
import { DamagedSettlementAddEditComponent } from './damaged-settlement/damaged-settlement-add-edit/damaged-settlement-add-edit.component';
import { DamagedSettlementListComponent } from './damaged-settlement/damaged-settlement-list/damaged-settlement-list.component';

const routes: Routes = [
  {
    path:'',
    component:StockTakingComponent,
    children:[
      {
        path:'stock-taking-trxes',
        component: StockTakingTrxesAddEditComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.stockTakingTrx,
          permissionType: permissionsTypes.insert
        },
      },
      {
        path:'stock-taking-trxes/list',
        component: StockTakingTrxesListComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.stockTakingTrx,
          permissionType: permissionsTypes.read
        },
      },
      {
        path:'stock-taking-trxes/:trxSerial',
        component: StockTakingTrxesAddEditComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.stockTakingTrx,
          permissionType: permissionsTypes.update
        },
      },
      {
        path:'damaged-settlement',
        component:DamagedSettlementAddEditComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.damagedSettlement,
          permissionType: permissionsTypes.insert

        },
      },
      {
        path:'damaged-settlement/list',
        component:DamagedSettlementListComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.damagedSettlement,
          permissionType: permissionsTypes.read

        },
      },
      {
        path:'damaged-settlement/:trxSerial',
        component:DamagedSettlementAddEditComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.damagedSettlement,
          permissionType: permissionsTypes.update
        },
      }
    ]
  }
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockTakingRoutingModule { }
