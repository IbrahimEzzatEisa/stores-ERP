import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login';
import { AuthGuard, PermissionsResolver } from './shared/services/guards';

const routes: Routes = [{
  path: '',
  component: AppComponent,
  children: [
    {
      path: '',
      redirectTo: 'pages',
      pathMatch: 'full'
    }, {
      path: 'pages',
      loadChildren: './pages/pages.module#PagesModule',
      canLoad:[AuthGuard],
      resolve: [PermissionsResolver]
    },{
      path: 'login',
      component: LoginComponent
    },{
      path: '**',
      redirectTo: 'pages'
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
