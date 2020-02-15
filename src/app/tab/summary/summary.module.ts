import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SummaryPageRoutingModule } from './summary-routing.module';

import { SummaryPage } from './summary.page';
import { CardElementComponent } from '../card-element/card-element.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SummaryPageRoutingModule,
    MatCardModule,
    MatButtonModule,
  ],
  declarations: [SummaryPage, CardElementComponent]
})
export class SummaryPageModule { }
