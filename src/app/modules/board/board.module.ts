import { NgModule } from '@angular/core';
import { BoardMainComponent } from './components/board-main/board-main.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BoardRoutingModule } from './board-routing.module';
import { IBoardService, boardFactory } from './services/board.service';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AddTokenInterceptor } from './interceptors/add-token-interceptor';
import { IAuthService } from 'src/app/shared/services/auth.service';
import { UnauthorizedInterceptor } from './interceptors/unauthorized-interceptor';

@NgModule({
  declarations: [BoardMainComponent],
  providers: [
    {
      provide: IBoardService,
      useFactory: boardFactory,
      deps: [HttpClient]
    },
    // Register HTTP Interceptors
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AddTokenInterceptor,
      multi: true,
      deps: [IAuthService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true,
      deps: [IAuthService]
    },
  ],
  imports: [
    SharedModule,
    BoardRoutingModule,
    FormsModule
  ]
})
export class BoardModule { }
