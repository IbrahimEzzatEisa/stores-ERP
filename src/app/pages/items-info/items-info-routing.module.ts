import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanDeactivateGuard, PermissionGuard, PERMISSIONS } from 'src/app/shared/services';
import { permissionsTypes } from 'src/app/shared/enums';

import { ItemsInfoComponent } from './items-info.component';
import { ItemGroupsComponent } from './item-groups/item-groups.component';
import { ItemsListComponent } from './items-list/items-list.component';
import { ItemsAddEditComponent } from './items-add-edit/items-add-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ItemsInfoComponent,
    children: [
      {
        path: 'item-groups',
        component: ItemGroupsComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.itemGroups,
          permissionType: permissionsTypes.open
        },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'items',
        component: ItemsAddEditComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.items,
          permissionType: permissionsTypes.insert
        },
        canDeactivate: [CanDeactivateGuard]
      },
       {
        path: 'items/list',
        component: ItemsListComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.items,
          permissionType: permissionsTypes.read
        },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'items/:groupId/:id/:year',
        component: ItemsAddEditComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.items,
          permissionType: permissionsTypes.update
        },
        canDeactivate: [CanDeactivateGuard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemsInfoRoutingModule { }
