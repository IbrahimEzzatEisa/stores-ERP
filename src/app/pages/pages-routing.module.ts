import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ErrorPageComponent } from '../pages/error-page/error-page.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full'
    },
    {
      path: 'home',
      component: HomeComponent
    },
    {
      path: 'main-codes',
      loadChildren: './main-codes/main-codes.module#MainCodesModule'
    },
    {
      path: 'stores-info',
      loadChildren: './stores-info/stores-info.module#StoresInfoModule'
    },
    {
      path: 'items-info',
      loadChildren: './items-info/items-info.module#ItemsInfoModule'
    },
    {
      path:'tools',
      loadChildren: './tools/tools.module#ToolsModule'
    },
    {
      path:'movements',
      loadChildren:'./movements/movements.module#MovementsModule'

    },
    {
      path:'reports',
      loadChildren:'./reports/reports.module#ReportsModule'
    },
    {
      path:'stock-taking',
      loadChildren:'./stock-taking/stock-taking.module#StockTakingModule'
    },
    {
      path:'employees-custody',
      loadChildren:'./employees-custody/employees-custody.module#EmployeesCustodyModule'
    },
    {
      path: 'change-password',
      component: ChangePasswordComponent
    },
    {
      path: 'page-not-found',
      component: ErrorPageComponent
    },
    {
      path: '**',
      redirectTo: 'page-not-found',
      pathMatch: 'full'
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
