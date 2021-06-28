import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarComponent } from './progress-bar.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
	declarations: [ProgressBarComponent],
	imports: [CommonModule, IonicModule],
	exports: [ProgressBarComponent],
})
export class ProgressBarModule {}
