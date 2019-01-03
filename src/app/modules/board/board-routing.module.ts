import { NgModule } from '@angular/core';
import { BoardMainComponent } from './components/board-main/board-main.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'board',
    component: BoardMainComponent,
    canActivate: [] // Guard would check permissions here when appropriate
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoardRoutingModule { }
