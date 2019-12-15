import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HostPage } from './host.page';

const routes: Routes = [
  {
    path: '',
    component: HostPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HostPageRoutingModule {}
