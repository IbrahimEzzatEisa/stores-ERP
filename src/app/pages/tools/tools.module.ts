import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ToolsRoutingModule } from './tools-routing.module';
import { ToolsComponent } from './tools.component';
import { SettingsComponent } from './settings/settings.component';
import { UsersAddEditComponent } from './users-add-edit/users-add-edit.component';
import { UsersListComponent } from './users-list/users-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UsersPermComponent } from './users-perm/users-perm.component';
import { BranchesPermComponent } from './branches-perm/branches-perm.component';
import { ChangeItemsYearComponent } from './change-items-year/change-items-year.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ToolsRoutingModule
  ],
  declarations: [
    ToolsComponent,
    SettingsComponent,
    UsersAddEditComponent,
    UsersListComponent,
    UsersPermComponent,
    BranchesPermComponent,
    ChangeItemsYearComponent
  ]
})
export class ToolsModule { }
