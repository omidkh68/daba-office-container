import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home.component';
import {DashboardComponent} from '../components/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
        data: {depth: 1, page: 'one'}
      }/*,
      {
        path: 'tasks',
        loadChildren: () => import('../components/tasks/tasks.module').then(m => m.TasksModule),
        data: {depth: 2, page: 'two'}
      },
      {
        path: 'users',
        loadChildren: () => import('../components/users/users.module').then(m => m.UsersModule),
        data: {depth: 3, page: 'three'}
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
