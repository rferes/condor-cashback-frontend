// login-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WalletComponent } from '../components/wallet.component';

import { AuthGuard } from 'src/app/utils/guards/auth.guard';

const routes: Routes = [
  {
    path: 'wallet',
    component: WalletComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletRoutingModule {}
