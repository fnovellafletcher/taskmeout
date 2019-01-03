import { NgModule } from '@angular/core';
import { RegisterMainComponent } from './components/register-main/register-main.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'register',
    component: RegisterMainComponent,
    canActivate: [] // Guard would check permissions here when appropriate
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule { }
