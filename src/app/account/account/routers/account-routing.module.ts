// login-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from '../components/account.component';
import { AuthGuard } from '../../../utils/guards/auth.guard';

const routes: Routes = [
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
