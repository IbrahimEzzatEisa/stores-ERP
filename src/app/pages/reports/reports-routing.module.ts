import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { MeasureUnitsComponent } from './item-reports/measure-units-report/measure-units.component';
import { ItemsDataComponent } from './item-reports/items-data-report/items-data.component';
import { ReturnItemCardComponent } from './item-reports/return-item-card-report/return-item-card.component';
import { ItemCardComponent } from './item-reports/item-card-report/item-card.component';
import { ReturnItemsDataReportComponent } from './item-reports/return-items-data-report/return-items-data-report.component';
import { StoreItemsBalanceReportComponent } from './stores-reports/store-items-balance-report/store-items-balance-report.component';
import { StoreKeepersReportComponent } from './stores-reports/store-keepers-report/store-keepers-report.component';
import { StoreReportComponent } from './stores-reports/store-report/store-report.component';
import { WorkPlacesReportComponent } from './stores-reports/work-places-report/work-places-report.component';
import { SuppliersReportComponent } from './movements-reports/suppliers-report/suppliers-report.component';
import { TrxTypesReportComponent } from './movements-reports/trx-types-report/trx-types-report.component';
import { EmpCustodyReportComponent } from './movements-reports/emp-custody-report/emp-custody-report.component';
import { ReceiveNoteReportComponent } from './movements-reports/receive-note-report/receive-note-report.component';
import { ReceiveRecordReportComponent } from './movements-reports/receive-record-report/receive-record-report.component';
import { ItemOutOrderReportComponent } from './movements-reports/item-out-order-report/item-out-order-report.component';
import { TempReceiveNotificationReportComponent } from './movements-reports/temp-receive-notification-report/temp-receive-notification-report.component';
import { TransferCustodyReportComponent } from './movements-reports/transfer-custody-report/transfer-custody-report.component';
import { ReturnDocumentReportComponent } from './movements-reports/return-document-report/return-document-report.component';

import { PermissionGuard, PERMISSIONS } from 'src/app/shared/services';
import { permissionsTypes } from 'src/app/shared/enums';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      {
        path: 'items-reports',
        children: [
          {
            path: 'measure-units',
            component: MeasureUnitsComponent,
            canActivate: [PermissionGuard],
            data: {
              permissionId: PERMISSIONS.measureUnitsReports,
              permissionType: permissionsTypes.open

            },
          },
          {
            path: 'items-data',
            component: ItemsDataComponent,
            canActivate: [PermissionGuard],
            data: {
              permissionId: PERMISSIONS.itemsDataReports,
              permissionType: permissionsTypes.open

            },
          },
          {
            path: 'return-item-card',
            component: ReturnItemCardComponent,
            canActivate: [PermissionGuard],
            data: {
              permissionId: PERMISSIONS.returnItemCardReports,
              permissionType: permissionsTypes.open

            },
          },
          {
            path: 'item-card',
            component: ItemCardComponent,
            canActivate: [PermissionGuard],
            data: {
              permissionId: PERMISSIONS.itemCardReports,
              permissionType: permissionsTypes.open

            },
          },
          {
            path: 'return-items-data-report',
            component: ReturnItemsDataReportComponent,
            canActivate: [PermissionGuard],
            data: {
              permissionId: PERMISSIONS.returnItemsDataReport,
              permissionType: permissionsTypes.open

            },
          }
        ]
      },
      {
        path: 'stores-reports',
        children: [
          {
            path: 'store-items-balance-report',
            component: StoreItemsBalanceReportComponent,
            canActivate: [PermissionGuard],
            data: {
              permissionId: PERMISSIONS.storeItemsBalanceReport,
              permissionType: permissionsTypes.open

            },
          },
          {
            path: 'store-keepers-report',
            component: StoreKeepersReportComponent,
            canActivate: [PermissionGuard],
            data: {
              permissionId: PERMISSIONS.storeKeepersReport,
              permissionType: permissionsTypes.open

            },
          },
          {
            path: 'store-report',
            component: StoreReportComponent,
            canActivate: [PermissionGuard],
            data: {
              permissionId: PERMISSIONS.storeReport,
              permissionType: permissionsTypes.open

            },
          },
          {
            path: 'work-places-report',
            component: WorkPlacesReportComponent,
            canActivate: [PermissionGuard],
            data: {
              permissionId: PERMISSIONS.workPlacesReport,
              permissionType: permissionsTypes.open

            },
          }
        ]
      },
      {
        path: 'movements-reports',
        children: [
          {
            path: 'suppliers-report',
            component: SuppliersReportComponent,
            canActivate: [PermissionGuard],
            data: {
              permissionId: PERMISSIONS.suppliersReport,
              permissionType: permissionsTypes.open

            },
          },
          {
            path: 'trx-types-report',
            component: TrxTypesReportComponent,
            canActivate: [PermissionGuard],
            data: {
              permissionId: PERMISSIONS.trxTypesReport,
              permissionType: permissionsTypes.open

            },
          },
          {
            path: 'emp-custody-report',
            component: EmpCustodyReportComponent,
            canActivate: [PermissionGuard],
            data: {
              permissionId: PERMISSIONS.empCustodyReport,
              permissionType: permissionsTypes.open

            },
          },
          {
            path: 'receive-note-report',
            component: ReceiveNoteReportComponent,
            canActivate: [PermissionGuard],
            data: {
              permissionId: PERMISSIONS.receiveNoteReport,
              permissionType: permissionsTypes.open

            },
          },
          {
            path: 'receive-record-report',
            component: ReceiveRecordReportComponent,
            canActivate: [PermissionGuard],
            data: {
              permissionId: PERMISSIONS.receiveRecordReport,
              permissionType: permissionsTypes.open

            },
          },
          {
            path: 'item-out-order-report',
            component: ItemOutOrderReportComponent,
            canActivate: [PermissionGuard],
            data: {
              permissionId: PERMISSIONS.itemOutOrderReport,
              permissionType: permissionsTypes.open

            },
          },
          {
            path: 'temp-receive-notification-report',
            component: TempReceiveNotificationReportComponent,
            canActivate: [PermissionGuard],
            data: {
              permissionId: PERMISSIONS.tempReceiveNotificationReport,
              permissionType: permissionsTypes.open

            },
          },
          {
            path: 'transfer-custody-report',
            component: TransferCustodyReportComponent,
            canActivate: [PermissionGuard],
            data: {
              permissionId: PERMISSIONS.transferCustodyReport,
              permissionType: permissionsTypes.open

            },
          },
          {
            path: 'return-document-report',
            component: ReturnDocumentReportComponent,
            canActivate: [PermissionGuard],
            data: {
              permissionId: PERMISSIONS.returnDocumentReport,
              permissionType: permissionsTypes.open

            },
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
