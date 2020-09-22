import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { permissionsTypes } from 'src/app/shared/enums';
import { PERMISSIONS,PermissionGuard,CanDeactivateGuard } from 'src/app/shared/services';

import { MovementsComponent } from './movements.component';
import { MngrOrdersAddEditComponent } from './mngr-orders/mngr-orders-add-edit/mngr-orders-add-edit.component';
import { MngrOrdersListComponent } from './mngr-orders/mngr-orders-list/mngr-orders-list.component';
import { OpeningBalanceAddEditComponent } from './opening-balance-add-edit/opening-balance-add-edit.component';
import { OpeningBalanceListComponent } from './opening-balance-list/opening-balance-list.component';
import { ReceiveNoteListComponent } from './receive-note-list/receive-note-list.component';
import { ReceiveNoteAddEditComponent } from './receive-note-add-edit/receive-note-add-edit.component';
import { ReceiveRecordAddEditComponent } from './receive-record/receive-record-add-edit/receive-record-add-edit.component';
import { ReceiveRecordListComponent } from './receive-record/receive-record-list/receive-record-list.component';
import { ItemOutOrderAddEditComponent } from './item-out-order-add-edit/item-out-order-add-edit.component';
import { ItemOutOrderListComponent } from './item-out-order-list/item-out-order-list.component';
import { TransferCustodyComponent } from './transfer-custody/transfer-custody.component';
import { TempReceiveNotificationListComponent } from './temp-receive-notification/temp-receive-notification-list/temp-receive-notification-list.component';
import { TempReceiveNotificationAddEditComponent } from './temp-receive-notification/temp-receive-notification-add-edit/temp-receive-notification-add-edit.component';
import { TransferCustodyListComponent } from './transfer-custody-list/transfer-custody-list.component';


const routes: Routes = [
  {
    path: '',
    component: MovementsComponent,
    children:[
      {
        path:'mngr-orders',
        component:MngrOrdersAddEditComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.mngrOrders,
          permissionType: permissionsTypes.insert

        },
        canDeactivate: [ CanDeactivateGuard ]
      },
      {
        path:'mngr-orders/list',
        component:MngrOrdersListComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.mngrOrders,
          permissionType: permissionsTypes.read

        },
        canDeactivate: [ CanDeactivateGuard ]
      },
      {
        path:'mngr-orders/:serial',
        component:MngrOrdersAddEditComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.mngrOrders,
          permissionType: permissionsTypes.update
        },
        canDeactivate: [ CanDeactivateGuard ]
      },
      {
        path:'opening-balance',
        component:OpeningBalanceAddEditComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.openingBalance,
          permissionType: permissionsTypes.insert

        },
        canDeactivate: [ CanDeactivateGuard ]
      },{
        path:'opening-balance/list',
        component: OpeningBalanceListComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.openingBalance,
          permissionType: permissionsTypes.read

        },
        canDeactivate: [ CanDeactivateGuard ]
      },
      {
        path:'opening-balance/:trxSerial',
        component:OpeningBalanceAddEditComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.openingBalance,
          permissionType: permissionsTypes.update

        },
        canDeactivate: [ CanDeactivateGuard ]
      },
      {
        path:'temp-receive-notification',
        component:TempReceiveNotificationAddEditComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.tempReceiveNotification,
          permissionType: permissionsTypes.insert

        },
        canDeactivate:[CanDeactivateGuard]

      },
      {
        path:'temp-receive-notification/list',
        component:TempReceiveNotificationListComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.tempReceiveNotification,
          permissionType: permissionsTypes.read

        },
        canDeactivate:[CanDeactivateGuard]

      },
      {
        path:'temp-receive-notification/:orderSerial',
        component:TempReceiveNotificationAddEditComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.tempReceiveNotification,
          permissionType: permissionsTypes.update

        },
        canDeactivate:[CanDeactivateGuard]

      },
      {
        path:'receive-note',
        component:ReceiveNoteAddEditComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.receiveNote,
          permissionType: permissionsTypes.insert

        },
        canDeactivate:[CanDeactivateGuard]
      },
      {
        path:'receive-note/list',
        component:ReceiveNoteListComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.receiveNote,
          permissionType: permissionsTypes.read

        },
        canDeactivate:[CanDeactivateGuard]
      },
      {
        path:'receive-note/:trxSerial',
        component:ReceiveNoteAddEditComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.receiveNote,
          permissionType: permissionsTypes.update
        },
        canDeactivate:[CanDeactivateGuard]
      },
      {
        path:'receive-record',
        component: ReceiveRecordAddEditComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.receiveRecord,
          permissionType: permissionsTypes.insert

        },
        canDeactivate:[CanDeactivateGuard]
      }, {
        path:'receive-record/list',
        component: ReceiveRecordListComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.receiveRecord,
          permissionType: permissionsTypes.read
        },
        canDeactivate:[CanDeactivateGuard]
      }, {
        path:'receive-record/:orderSerial',
        component: ReceiveRecordAddEditComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.receiveRecord,
          permissionType: permissionsTypes.update
        },
        canDeactivate:[CanDeactivateGuard]
      },
      {
        path:'item-out-order',
        component:ItemOutOrderAddEditComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.itemOutOrder,
          permissionType: permissionsTypes.insert

        },
        canDeactivate:[CanDeactivateGuard]
      },
      {
        path:'item-out-order/list',
        component:ItemOutOrderListComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.itemOutOrder,
          permissionType: permissionsTypes.read

        },
        canDeactivate:[CanDeactivateGuard]
      },
       {
        path:'item-out-order/:trxSerial',
        component:ItemOutOrderAddEditComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.itemOutOrder,
          permissionType: permissionsTypes.update

        },
        canDeactivate:[CanDeactivateGuard]
      },
       {
        path:'transfer-custody',
        component:TransferCustodyComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.transferCustody,
          permissionType: permissionsTypes.insert

        },
        canDeactivate:[CanDeactivateGuard]
      
      },
      {
       path:'transfer-custody/list',
       component:TransferCustodyListComponent,
       canActivate: [PermissionGuard],
       data: {
         permissionId: PERMISSIONS.transferCustody,
         permissionType: permissionsTypes.read

       },
       canDeactivate:[CanDeactivateGuard]
     
     },
     {
      path:'transfer-custody/:trxSerial',
      component:TransferCustodyComponent,
      canActivate: [PermissionGuard],
      data: {
        permissionId: PERMISSIONS.transferCustody,
        permissionType: permissionsTypes.update

      },
      canDeactivate:[CanDeactivateGuard]
    
    },

    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovementsRoutingModule { }
