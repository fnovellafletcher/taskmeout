import { NgModule } from '@angular/core';
import { BoardMainComponent } from './components/board-main/board-main.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BoardRoutingModule } from './board-routing.module';

@NgModule({
  declarations: [BoardMainComponent],
  imports: [
    SharedModule,
    BoardRoutingModule
  ]
})
export class BoardModule { }
