import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {AuthGuardService} from './guards/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    canActivate: [AuthGuardService],
    pathMatch: 'full'
  },
  {
    path: 'login',
    // canActivate: [CheckLogin],
    component: LoginComponent
  },
  {path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
