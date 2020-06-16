import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProfilePageRoutingModule } from './profile-routing.module';
import { ProfilePage } from './profile.page';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [ProfilePage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoreModule,
    ProfilePageRoutingModule,
  ],
})
export class ProfilePageModule {}