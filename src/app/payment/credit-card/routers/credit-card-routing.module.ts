// login-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditCardListComponent } from '../credit-card-list/components/credit-card-list.component';
import { CreditCardViewComponent } from '../credit-card-view/components/credit-card-view.component';

import { AuthGuard } from 'src/app/utils/guards/auth.guard';

const routes: Routes = [
  {
    path: 'payment/credit-card-list',
    component: CreditCardListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'payment/credit-card-view/:id',
    component: CreditCardViewComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditCardRoutingModule {}
