import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../components/tasks/tasks.module').then(m => m.TasksModule),
        data: {depth: 1, page: 'one'}
      },
      {
        path: 'tasks',
        redirectTo: ''
      },
      {
        path: 'users',
        loadChildren: () => import('../components/users/users.module').then(m => m.UsersModule),
        data: {depth: 1, page: 'two'}
      }
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
