import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemsInfoRoutingModule } from './items-info-routing.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ItemsInfoComponent } from './items-info.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ItemGroupsComponent } from './item-groups/item-groups.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { ItemsListComponent } from './items-list/items-list.component';
import { ItemsAddEditComponent } from './items-add-edit/items-add-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ItemsInfoRoutingModule,
    NgbModalModule,
    NgxBarcodeModule,
  ],
  declarations: [
    ItemsInfoComponent,
    ItemsAddEditComponent,
    ItemGroupsComponent,
    ItemsListComponent
  ]
})
export class ItemsInfoModule { }
