import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home.component';
import {AuthGuardService} from '../guards/auth-guard.service';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../components/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthGuardService]
      }/*,
      {
        path: 'selectCompany',
        loadChildren: () => import('../components/select-company/select-company.module').then(m => m.SelectCompanyModule),
        canActivate: [AuthGuardService]
      }*/
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
