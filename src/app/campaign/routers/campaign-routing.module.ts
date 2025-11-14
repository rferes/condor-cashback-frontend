// login-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampaignListComponent } from '../campaign-list/components/campaign-list.component';
import { CampaignEditComponent } from '../campaign-edit/components/campaign-edit.component';
import { CampaignViewComponent } from '../campaign-view/components/campaign-view.component';
import { AuthGuard } from 'src/app/utils/guards/auth.guard';

const routes: Routes = [
  {
    path: 'campaign-list',
    component: CampaignListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'campaign-view/:id',
    component: CampaignViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'campaign-edit/:id',
    component: CampaignEditComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampaignRoutingModule {}
