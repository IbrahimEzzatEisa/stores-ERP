import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanDeactivateGuard, PermissionGuard, PERMISSIONS } from 'src/app/shared/services';
import { permissionsTypes } from 'src/app/shared/enums';

import { StoresInfoComponent } from './stores-info.component';
import { EmployeesComponent } from './employees/employees.component';
import { StoresAddEditComponent } from './stores-add-edit/stores-add-edit.component';
import { StoresListComponent } from './stores-list/stores-list.component';
import { StoreKeepersComponent } from './store-keepers/store-keepers.component';
import { WorkPlacesListComponent } from './work-places-list/work-places-list.component';
import { WorkPlacesAddEditComponent } from './work-places-add-edit/work-places-add-edit.component';

const routes: Routes = [{
  path: '',
  component: StoresInfoComponent,
  children: [
    {
      path: 'employees',
      component: EmployeesComponent,
      canActivate: [PermissionGuard],
      data: {
        permissionId: PERMISSIONS.employees,
        permissionType: permissionsTypes.open

      },
      canDeactivate: [ CanDeactivateGuard ]
    },
    {
      path:'stores',
      component: StoresAddEditComponent,
      canActivate: [PermissionGuard],
      data: {
        permissionId: PERMISSIONS.stores,
        permissionType: permissionsTypes.insert

      },
      canDeactivate: [ CanDeactivateGuard ]
    },
    {
      path:'stores/list',
      component: StoresListComponent,
      canActivate: [PermissionGuard],
      data: {
        permissionId: PERMISSIONS.stores,
        permissionType: permissionsTypes.read

      },
      canDeactivate: [ CanDeactivateGuard ]
    },
    {
      path:'stores/:id',
      component: StoresAddEditComponent,
      canActivate: [PermissionGuard],
      data: {
        permissionId: PERMISSIONS.stores,
        permissionType: permissionsTypes.update

      },
      canDeactivate: [ CanDeactivateGuard ]
    },
    {
      path:'store-keepers',
      component:StoreKeepersComponent,
      canActivate: [PermissionGuard],
      data: {
        permissionId: PERMISSIONS.storeKeepers,
        permissionType: permissionsTypes.open

      },
      canDeactivate: [ CanDeactivateGuard ]
    },
    {
      path: 'work-places',
      component: WorkPlacesAddEditComponent,
      canActivate: [PermissionGuard],
      data: {
        permissionId: PERMISSIONS.workPlaces,
        permissionType: permissionsTypes.insert

      },
      canDeactivate: [ CanDeactivateGuard ]
    },
    {
      path: 'work-places/list',
      component: WorkPlacesListComponent,
      canActivate: [PermissionGuard],
      data: {
        permissionId: PERMISSIONS.workPlaces,
        permissionType: permissionsTypes.read

      },
      canDeactivate: [ CanDeactivateGuard ]
    },
    {
      path: 'work-places/:id',
      component: WorkPlacesAddEditComponent,
      canActivate: [PermissionGuard],
      data: {
        permissionId: PERMISSIONS.workPlaces,
        permissionType: permissionsTypes.update

      },
      canDeactivate: [ CanDeactivateGuard ]
    }
  ]
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoresInfoRoutingModule { }
