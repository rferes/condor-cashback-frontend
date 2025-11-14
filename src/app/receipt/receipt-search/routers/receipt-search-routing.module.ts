// login-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceiptSearchComponent } from '../components/receipt-search.component';

const routes: Routes = [
  {
    path: 'search',
    component: ReceiptSearchComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceiptSearchRoutingModule {}
