// login-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutoReloadCampaignCreditComponent } from '../components/auto-reload-campaign-credit.component';

import { AuthGuard } from 'src/app/utils/guards/auth.guard';

const routes: Routes = [
  {
    path: 'merchant/auto-reload-campaign-credit',
    component: AutoReloadCampaignCreditComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutoReloadCampaignCreditRoutingModule {}
