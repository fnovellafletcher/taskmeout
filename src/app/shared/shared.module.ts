import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule, MatDividerModule, MatProgressBarModule} from '@angular/material';

@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule,

    // Angular material modules
    MatIconModule,
  ],
  exports: [
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
    MatInputModule
  ]
})
export class SharedModule { }
