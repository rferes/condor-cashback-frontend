// login-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionViewComponent } from '../transaction-view/components/transaction-view.component';
import { TransactionListComponent } from '../transaction-list/components/transaction-list.component';
import { AuthGuard } from 'src/app/utils/guards/auth.guard';

const routes: Routes = [
  {
    path: 'reports/transaction-list',
    component: TransactionListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'reports/transaction-view/:id',
    component: TransactionViewComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionRoutingModule {}
