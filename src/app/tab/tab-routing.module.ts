import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabPage } from './tab.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'profile',
    pathMatch: 'full',
  },
  {
    path: '',
    component: TabPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('../profile/profile.module').then((m) => m.ProfilePageModule),
      },
      {
        path: 'host',
        loadChildren: () =>
          import('../host/host.module').then((m) => m.HostPageModule),
      },
      {
        path: 'summary',
        loadChildren: () =>
          import('./summary/summary.module').then((m) => m.SummaryPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabPageRoutingModule {}
