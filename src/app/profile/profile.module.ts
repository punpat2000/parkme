import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProfilePageRoutingModule } from './profile-routing.module';
import { ProfilePage } from './profile.page';
import { PipesModule } from '../core/pipes.module';

@NgModule({
  declarations: [ProfilePage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ProfilePageRoutingModule,
  ],
})
export class ProfilePageModule {}