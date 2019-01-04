import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule, MatDividerModule, MatProgressBarModule, MatChipsModule, MatSnackBar, MatSnackBarModule } from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { IAuthService, authFactory } from './services/auth.service';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './interceptors/error-interceptor';
import { CorsHeaderInterceptor } from './interceptors/cors-header-interceptor';

@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule,

    // Angular material modules
    MatIconModule,
    MatSnackBarModule,
  ],
  providers: [
    {
      provide: IAuthService,
      useFactory: authFactory,
      deps: [HttpClient]
    },
    // Register HTTP Interceptors
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
      deps: [MatSnackBar]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CorsHeaderInterceptor,
      multi: true,
    },
  ],
  exports: [
    HttpClientModule,
    HeaderComponent,

    // Angular material modules
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatTabsModule,
    MatProgressBarModule,
    BrowserAnimationsModule, // requirement from MatTabsModule
    MatFormFieldModule,
    MatChipsModule,
    MatInputModule,
    MatMenuModule,
    MatDialogModule,
    DragDropModule
  ]
})
export class SharedModule { }
