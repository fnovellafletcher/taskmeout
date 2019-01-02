import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginMainComponent } from './components/login-main/login-main.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginMainComponent,
    canActivate: [] // Guard would check permissions here when appropriate
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
