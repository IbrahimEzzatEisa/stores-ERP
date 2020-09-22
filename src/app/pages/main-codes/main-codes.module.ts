import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';
import { MainCodesRoutingModule } from './main-codes-routing.module';
import { MainCodesComponent } from './main-codes.component';

import { BranchesComponent } from './branches/branches.component';
import { StoreTypesComponent } from './store-types/store-types.component';
import { StoreSectionsComponent } from './store-sections/store-sections.component';
import { UnitsComponent } from './units/units.component';
import { ItemTypesComponent } from './item-types/item-types.component';
import { ItemStatesComponent } from './item-states/item-states.component';
import { SpecificationsComponent } from './specifications/specifications.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';
import { StockTakingTypesComponent } from './stock-taking-types/stock-taking-types.component';
import { SuppliersAddEditComponent } from './suppliers-add-edit/suppliers-add-edit.component';
import { SuppliersListComponent } from './suppliers-list/suppliers-list.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    MainCodesRoutingModule,
  ],
  declarations: [
    MainCodesComponent, 
    BranchesComponent,
    StoreTypesComponent,
    StoreSectionsComponent,
    UnitsComponent,
    ItemTypesComponent,
    ItemStatesComponent,
    SpecificationsComponent,
    RecommendationsComponent,
    StockTakingTypesComponent,
    SuppliersAddEditComponent,
    SuppliersListComponent
  ]
})
export class MainCodesModule { }
