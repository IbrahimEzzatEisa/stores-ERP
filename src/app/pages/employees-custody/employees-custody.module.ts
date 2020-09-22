import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { EmployeesCustodyRoutingModule } from './employees-custody-routing.module';
import { EmployeesCustodyComponent } from './employees-custody.component';
import { CustodyRegisterTransfereAddEditComponent } from './custody-register-transfere/custody-register-transfere-add-edit/custody-register-transfere-add-edit.component';
import { CustodyRegisterTransfereListComponent } from './custody-register-transfere/custody-register-transfere-list/custody-register-transfere-list.component';
import { CustodyRegisterTransfereItemsComponent } from './custody-register-transfere/custody-register-transfere-items/custody-register-transfere-items.component';
import { ReturnDocumentAddEditComponent } from './return-document/return-document-add-edit/return-document-add-edit.component';
import { ReturnDocumentListComponent } from './return-document/return-document-list/return-document-list.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    EmployeesCustodyRoutingModule
  ],
  declarations: [
    EmployeesCustodyComponent, 
    CustodyRegisterTransfereAddEditComponent, 
    CustodyRegisterTransfereListComponent,
    CustodyRegisterTransfereItemsComponent,
    ReturnDocumentAddEditComponent,
    ReturnDocumentListComponent,
  ]
})
export class EmployeesCustodyModule { }
