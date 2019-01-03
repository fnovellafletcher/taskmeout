import { NgModule } from '@angular/core';
import { BoardMainComponent } from './components/board-main/board-main.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BoardRoutingModule } from './board-routing.module';
import { IBoardService, boardFactory } from './services/board.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [BoardMainComponent],
  providers: [
    {
      provide: IBoardService,
      useFactory: boardFactory,
      deps: [HttpClient]
    }
  ],
  imports: [
    SharedModule,
    BoardRoutingModule,
    FormsModule
  ]
})
export class BoardModule { }
