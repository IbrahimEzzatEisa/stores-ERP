import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { permissionsTypes } from 'src/app/shared/enums';
import { PERMISSIONS,PermissionGuard,CanDeactivateGuard } from 'src/app/shared/services';

import { MainCodesComponent } from './main-codes.component';
import { BranchesComponent } from './branches/branches.component';
import { SuppliersAddEditComponent } from './suppliers-add-edit/suppliers-add-edit.component';
import { SuppliersListComponent } from './suppliers-list/suppliers-list.component';
import { StoreTypesComponent } from './store-types/store-types.component';
import { StoreSectionsComponent } from './store-sections/store-sections.component';
import { UnitsComponent } from './units/units.component';
import { ItemTypesComponent } from './item-types/item-types.component';
import { ItemStatesComponent } from './item-states/item-states.component';
import { SpecificationsComponent } from './specifications/specifications.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';
import { StockTakingTypesComponent } from './stock-taking-types/stock-taking-types.component';

const routes: Routes = [
  {
    path: '',
    component: MainCodesComponent,
    children:[
      {
        path:'branches',
        component:BranchesComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.branches,
          permissionType: permissionsTypes.open
        },
        canDeactivate: [ CanDeactivateGuard ]
      },
      {
        path:'suppliers/list',
        component: SuppliersListComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.suppliers,
          permissionType: permissionsTypes.read

        },
        canDeactivate: [ CanDeactivateGuard ]
      },
      {
        path:'suppliers',
        component:SuppliersAddEditComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.suppliers,
          permissionType: permissionsTypes.insert
        },
        canDeactivate: [ CanDeactivateGuard ]
      },
      {
        path:'suppliers/:id',
        component:SuppliersAddEditComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.suppliers,
          permissionType: permissionsTypes.update
        },
        canDeactivate: [ CanDeactivateGuard ]
      },
      {
        path:'store-types',
        component:StoreTypesComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.storeTypes,
          permissionType: permissionsTypes.open
        },
        canDeactivate: [ CanDeactivateGuard ]
      },
      {
        path:'store-sections',
        component:StoreSectionsComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.storeSections,
          permissionType: permissionsTypes.open
        },
        canDeactivate: [ CanDeactivateGuard ]
      },
      {
        path:'units',
        component:UnitsComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.units,
          permissionType: permissionsTypes.open
        },
        canDeactivate: [ CanDeactivateGuard ]
      },
      {
        path:'item-types',
        component:ItemTypesComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.itemTypes,
          permissionType: permissionsTypes.open
        },
        canDeactivate: [ CanDeactivateGuard ]
      },
      {
        path:'item-states',
        component:ItemStatesComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.itemStates,
          permissionType: permissionsTypes.open
        },
        canDeactivate: [ CanDeactivateGuard ]
      },
      {
        path:'specifications',
        component:SpecificationsComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.specifications,
          permissionType: permissionsTypes.open
        },
        canDeactivate: [ CanDeactivateGuard ]
      },
      {
        path:'recommendations',
        component:RecommendationsComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.recommendations,
          permissionType: permissionsTypes.open
        },
        canDeactivate: [ CanDeactivateGuard ]
      },
      {
        path:'stock-taking-types',
        component:StockTakingTypesComponent,
        canActivate: [PermissionGuard],
        data: {
          permissionId: PERMISSIONS.stockTakingTypes,
          permissionType: permissionsTypes.open
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
export class MainCodesRoutingModule { }
