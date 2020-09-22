import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanDeactivateGuard, PermissionGuard, PERMISSIONS } from '../../shared/services';
import { EmployeesCustodyComponent } from './employees-custody.component';
import { CustodyRegisterTransfereAddEditComponent } from './custody-register-transfere/custody-register-transfere-add-edit/custody-register-transfere-add-edit.component';
import { CustodyRegisterTransfereListComponent } from './custody-register-transfere/custody-register-transfere-list/custody-register-transfere-list.component';
import { permissionsTypes } from 'src/app/shared/enums';
import { ReturnDocumentAddEditComponent } from './return-document/return-document-add-edit/return-document-add-edit.component';
import { ReturnDocumentListComponent } from './return-document/return-document-list/return-document-list.component';

const routes: Routes = [{
  path:'',
  component:EmployeesCustodyComponent,
  children:[

    {
      path:'custody-register',
      component: CustodyRegisterTransfereAddEditComponent,
      canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.custodyTrx,
          permissionType: permissionsTypes.insert
        },
      canDeactivate: [ CanDeactivateGuard ]
    },{
      path:'custody-register/list',
      component: CustodyRegisterTransfereListComponent,
      canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.custodyTrx,
          permissionType: permissionsTypes.read
        },
      canDeactivate: [ CanDeactivateGuard ]
    },{
      path:'custody-register/:serial',
      component: CustodyRegisterTransfereAddEditComponent,
      canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.custodyTrx,
          permissionType: permissionsTypes.update
        },
      canDeactivate: [ CanDeactivateGuard ]
    },

    {
      path:'custody-transfer',
      component: CustodyRegisterTransfereAddEditComponent,
      canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.custodyTransfer,
          permissionType: permissionsTypes.insert
        },
      canDeactivate: [ CanDeactivateGuard ]
    },{
      path:'custody-transfer/list',
      component: CustodyRegisterTransfereListComponent,
      canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.custodyTransfer,
          permissionType: permissionsTypes.read
        },
      canDeactivate: [ CanDeactivateGuard ]
    }, {
      path:'custody-transfer/:serial',
      component: CustodyRegisterTransfereAddEditComponent,
      canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.custodyTransfer,
          permissionType: permissionsTypes.update
        },
      canDeactivate: [ CanDeactivateGuard ]
    },
    {
      path:'return-document',
      component:ReturnDocumentAddEditComponent,
      canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.returnDocument,
          permissionType: permissionsTypes.insert
        },
      canDeactivate: [ CanDeactivateGuard ]
    },
    {
      path:'return-document/list',
      component:ReturnDocumentListComponent,
      canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.returnDocument,
          permissionType: permissionsTypes.read
        },
      canDeactivate: [ CanDeactivateGuard ]
    },
    {
      path:'return-document/:trxSerial',
      component:ReturnDocumentAddEditComponent,
      canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.returnDocument,
          permissionType: permissionsTypes.update
        },
      canDeactivate: [ CanDeactivateGuard ]
    }
  ]
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesCustodyRoutingModule { }
