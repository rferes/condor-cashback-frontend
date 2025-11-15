// login-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsumerGroupListComponent } from '../consumer-group-list/components/consumer-group-list.component';
import { ConsumerGroupViewComponent } from '../consumer-group-view/components/consumer-group-view.component';
import { AuthGuard } from 'src/app/utils/guards/auth.guard';

const routes: Routes = [
  {
    path: 'merchant/consumer-group-list',
    component: ConsumerGroupListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'merchant/consumer-group-view/:id',
    component: ConsumerGroupViewComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsumerGroupRoutingModule {}
