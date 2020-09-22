import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard, PermissionGuard, PERMISSIONS } from 'src/app/shared/services';

import { UsersListComponent } from './users-list/users-list.component';
import { UsersAddEditComponent } from './users-add-edit/users-add-edit.component';
import { ToolsComponent } from './tools.component';
import { SettingsComponent } from './settings/settings.component';
import { UsersPermComponent } from './users-perm/users-perm.component';
import { BranchesPermComponent } from './branches-perm/branches-perm.component';
import { ChangeItemsYearComponent } from './change-items-year/change-items-year.component';
import { permissionsTypes } from 'src/app/shared/enums';

const routes: Routes = [
  {
    path: '',
    component: ToolsComponent,
    children: [
      {
        path: 'users/list',
        component: UsersListComponent,
        canActivate: [PermissionGuard],
        data: { 
          permissionId: PERMISSIONS.users,
          permissionType: permissionsTypes.read
        },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'users',
        component: UsersAddEditComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.users,
          permissionType: permissionsTypes.insert
        },
        canDeactivate: [CanDeactivateGuard]
      }, {
        path: 'users/:id',
        component: UsersAddEditComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.users,
          permissionType: permissionsTypes.update
        },
        canDeactivate: [CanDeactivateGuard]
      }, {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.settings,
          permissionType: permissionsTypes.open
        },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'users-perm',
        component: UsersPermComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.usersPerm,
          permissionType: permissionsTypes.open
        },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'branches-perm',
        component: BranchesPermComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.branchesPerm,
          permissionType: permissionsTypes.open
        },
        canDeactivate: [CanDeactivateGuard]
      }, {
        path: 'change-items-year',
        component: ChangeItemsYearComponent,
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolsRoutingModule { }
