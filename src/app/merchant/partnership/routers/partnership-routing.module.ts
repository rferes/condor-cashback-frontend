// partnership-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartnershipGuestViewComponent } from '../partnership-guest-view/components/partnership-view.component';
import { PartnershipListComponent } from '../partnership-list/components/partnership-list.component';
import { AuthGuard } from 'src/app/utils/guards/auth.guard';
import { PartnershipHostViewComponent } from '../partnership-host-view/components/partnership-view.component';
const routes: Routes = [
  {
    path: 'merchant/partnership-view/:id',
    component: PartnershipGuestViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'merchant/partnership-list',
    component: PartnershipListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'merchant/partnership-host-view/:id',
    component: PartnershipHostViewComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartnershipRoutingModule {}
