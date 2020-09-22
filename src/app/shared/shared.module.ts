import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ReceiveRecodItemsModalComponent } from 'src/app/pages/movements/receive-record/receive-recod-items-modal/receive-recod-items-modal.component';
import {MngrOrdersItemsModalComponent} from 'src/app/pages/movements/mngr-orders/mngr-orders-items-modal/mngr-orders-items-modal.component';
import { StockTakingTrxItemsModalComponent } from 'src/app/pages/stock-taking/stock-taking-trxes/stock-taking-trx-items-modal/stock-taking-trx-items-modal.component';
import { CustodyRegisterTransfereItemsModalComponent } from 'src/app/pages/employees-custody/custody-register-transfere/custody-register-transfere-items-modal/custody-register-transfere-items-modal.component';
import { TempReceiveNotificationItemsModalComponent } from 'src/app/pages/movements/temp-receive-notification/temp-receive-notification-items-modal/temp-receive-notification-items-modal.component';

import {
    MainHeaderComponent,
    MainTopNavComponent,
    MenuListItemComponent,
    DeleteConfirmationModalComponent,
    PaintComponent,
    CodeNameTableComponent,
    CrudTableComponent,
    PermissionsStringComponent,
    SortableColumnComponent,
    ListTableComponent,
    PaginationComponent,
    TableInfoComponent,
    PageTitleComponent,
    FormNavigatorComponent,
    GregorianHijriCalendarComponent,
    ItemListTableComponent,
    AddEditItemTableModalComponent,
    EmployeesMinTableComponent,
    DropdownListComponent,
    AddAllItemsModalComponent
} from './components';



import {
    AuthGuard,
    CanDeactivateGuard,
    PermissionsResolver,
    PermissionGuard,
} from './services/guards';
const guards = [
    AuthGuard,
    CanDeactivateGuard,
    PermissionsResolver,
    PermissionGuard,
]

import {
    BranchesService, 
    UnitsService,
    ObjectsOperationsService,
    StoreSectionsService,
    SortServiceService,
    RecommendationsService,
    ItemStatesService,
    SpecificationService,
    StoreTypesService,
    ItemGroupsService,
    StoreKeepersService,
    EmployeesService,
    UsersService,
    AuthenticationService,
    MenusDropDownService,
    StockTakingTypesService,
    WorkPlacesService,
    ItemsService,
    UsersPermsService,
    PermissionsService,
    permissionsAppInitService,
    ItemTypesService,
    SwalService,
    ApiHelper,
    SharedSettingsService,
    DateService,
    StoresTrxesService,
    StoresTrxItemsService,
    MngrOrdersService,
    StockTakingTrxesService,
    StockTakingTrxItemsService,
    CustodyTrxesService,
    CustodyTrxItemsService,
    ReportsService
} from './services';

const APIs = [
    BranchesService,
    UnitsService,
    ObjectsOperationsService,
    StoreSectionsService,
    SortServiceService,
    RecommendationsService,
    ItemStatesService,
    SpecificationService,
    StoreTypesService,
    ItemGroupsService,
    StoreKeepersService,
    EmployeesService,
    MenusDropDownService,
    UsersService,
    MenusDropDownService,
    StockTakingTypesService,
    MenusDropDownService,
    WorkPlacesService,
    ItemsService,
    UsersPermsService,
    ItemTypesService,
    ApiHelper,
    StoresTrxesService,
    StoresTrxItemsService,
    MngrOrdersService,
    StockTakingTrxesService,
    StockTakingTrxItemsService,
    CustodyTrxesService,
    CustodyTrxItemsService,
    ReportsService
]

const SERVICES = [
    ...APIs,
    ...guards,
    AuthenticationService,
    PermissionsService,
    permissionsAppInitService,
    SwalService,
    SharedSettingsService,
    DateService
];

import {
    SortableTableDirective,
    DropdownListInputDirective,
    IntegerDirective
} from './directives';

const COMPONENTS = [
    MainHeaderComponent,
    MainTopNavComponent,
    MenuListItemComponent,
    DeleteConfirmationModalComponent,
    CodeNameTableComponent,
    SortableColumnComponent,
    PaintComponent,
    CrudTableComponent,
    PermissionsStringComponent,
    ListTableComponent,
    PaginationComponent,
    TableInfoComponent,
    PageTitleComponent,
    FormNavigatorComponent,
    GregorianHijriCalendarComponent,
    ItemListTableComponent,
    ReceiveRecodItemsModalComponent,
    StockTakingTrxItemsModalComponent,
    CustodyRegisterTransfereItemsModalComponent,
    EmployeesMinTableComponent,
    TempReceiveNotificationItemsModalComponent,
    DropdownListComponent
]

const ENTRY_COMPONENTS = [
    DeleteConfirmationModalComponent,
    AddEditItemTableModalComponent,
    ReceiveRecodItemsModalComponent,
    MngrOrdersItemsModalComponent,
    StockTakingTrxItemsModalComponent,
    CustodyRegisterTransfereItemsModalComponent,
    TempReceiveNotificationItemsModalComponent,
    AddAllItemsModalComponent
];


const DIRECTIVES = [
    SortableTableDirective,
    DropdownListInputDirective,
    IntegerDirective
];

import { FilterPipe, paginate ,SelectPipe, AppDatePipe, TafqeetPipe} from './pipes';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
const PIPES = [
  FilterPipe,
  paginate,
  SelectPipe,
  AppDatePipe,
  TafqeetPipe
];

@NgModule({
    declarations: [
        ...COMPONENTS,
        ...ENTRY_COMPONENTS,
        ...DIRECTIVES,
        ...PIPES,
        ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgbPopoverModule
        ],
    exports: [
        ...COMPONENTS,
        ...ENTRY_COMPONENTS,
        ...DIRECTIVES,
        ...PIPES
    ],
    entryComponents: [
        ...ENTRY_COMPONENTS
    ]
})

export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return <ModuleWithProviders> {
            ngModule: SharedModule,
            providers: [
                ...SERVICES
            ]
        }
    }
}