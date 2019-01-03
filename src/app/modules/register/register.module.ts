import { NgModule } from '@angular/core';
import { RegisterMainComponent } from './components/register-main/register-main.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RegisterRoutingModule } from './register-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { IRegisterService, registerFactory } from './services/register.service';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [RegisterMainComponent],
  providers: [
    {
      provide: IRegisterService,
      useFactory: registerFactory,
      deps: [HttpClient]
    }
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RegisterRoutingModule
  ]
})
export class RegisterModule { }
