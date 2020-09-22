import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';
import { StoresInfoRoutingModule } from './stores-info-routing.module';
import { StoresInfoComponent } from './stores-info.component';
import { EmployeesComponent } from './employees/employees.component';
import { StoresAddEditComponent } from './stores-add-edit/stores-add-edit.component';
import { StoresListComponent } from './stores-list/stores-list.component';
import { WorkPlacesAddEditComponent } from './work-places-add-edit/work-places-add-edit.component';
import { WorkPlacesListComponent } from './work-places-list/work-places-list.component';
import { StoreKeepersComponent } from './store-keepers/store-keepers.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    StoresInfoRoutingModule
  ],
  declarations: [
    StoresInfoComponent, 
    EmployeesComponent, 
    StoreKeepersComponent, 
    StoresAddEditComponent, 
    StoresListComponent, 
    WorkPlacesAddEditComponent, 
    WorkPlacesListComponent
  ]
})
export class StoresInfoModule { }
