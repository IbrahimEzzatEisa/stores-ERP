import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';
import { MovementsRoutingModule } from './movements-routing.module';
import { MovementsComponent } from './movements.component';
import { MngrOrdersAddEditComponent } from './mngr-orders/mngr-orders-add-edit/mngr-orders-add-edit.component';
import { MngrOrdersListComponent } from './mngr-orders/mngr-orders-list/mngr-orders-list.component';
import { MngrOrdersItemsComponent } from './mngr-orders/mngr-orders-items/mngr-orders-items.component';
import { ReceiveRecordAddEditComponent } from './receive-record/receive-record-add-edit/receive-record-add-edit.component';
import { ReceiveRecordListComponent } from './receive-record/receive-record-list/receive-record-list.component';
import { ReceiveRecodItemsComponent } from './receive-record/receive-recod-items/receive-recod-items.component';

import { TransferCustodyComponent } from './transfer-custody/transfer-custody.component';
import { OpeningBalanceListComponent } from './opening-balance-list/opening-balance-list.component';
import { OpeningBalanceAddEditComponent } from './opening-balance-add-edit/opening-balance-add-edit.component';
import { ReceiveNoteAddEditComponent } from './receive-note-add-edit/receive-note-add-edit.component';
import { ReceiveNoteListComponent } from './receive-note-list/receive-note-list.component';
import { ItemOutOrderAddEditComponent } from './item-out-order-add-edit/item-out-order-add-edit.component';
import { ItemOutOrderListComponent } from './item-out-order-list/item-out-order-list.component';
import { TransferCustodyListComponent } from './transfer-custody-list/transfer-custody-list.component';
import { TempReceiveNotificationAddEditComponent } from './temp-receive-notification/temp-receive-notification-add-edit/temp-receive-notification-add-edit.component';
import { TempReceiveNotificationListComponent } from './temp-receive-notification/temp-receive-notification-list/temp-receive-notification-list.component';
import { TempReceiveNotificationItemsComponent } from './temp-receive-notification/temp-receive-notification-items/temp-receive-notification-items.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    MovementsRoutingModule
  ],
  declarations: [
    MovementsComponent,
    MngrOrdersItemsComponent,
    MngrOrdersAddEditComponent, 
    MngrOrdersListComponent,
    ReceiveRecordAddEditComponent,
    ReceiveRecordListComponent,
    ReceiveRecodItemsComponent,
    TransferCustodyComponent, 
    OpeningBalanceListComponent, 
    OpeningBalanceAddEditComponent, 
    ReceiveNoteAddEditComponent, 
    ReceiveNoteListComponent, 
    ItemOutOrderAddEditComponent, 
    ItemOutOrderListComponent, 
    TransferCustodyListComponent,
    MngrOrdersAddEditComponent, 
    MngrOrdersListComponent,
    TempReceiveNotificationAddEditComponent, 
    TempReceiveNotificationListComponent, 
    TempReceiveNotificationItemsComponent, 
    TransferCustodyListComponent
  ]

})
export class MovementsModule { }
