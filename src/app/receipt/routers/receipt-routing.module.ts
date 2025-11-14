// login-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceiptListComponent } from 'src/app/receipt/receipt-list/components/receipt-list.component';
import { ReceiptViewComponent } from 'src/app/receipt/receipt-view/components/receipt-view.component';
import { AuthGuard } from 'src/app/utils/guards/auth.guard';

const routes: Routes = [
  {
    path: 'reports/receipt-list',
    component: ReceiptListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'reports/receipt-view/:id',
    component: ReceiptViewComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceiptRoutingModule {}
