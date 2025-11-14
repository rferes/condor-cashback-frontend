// login-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../components/dashboard.component';
import { AuthGuard } from '../../../utils/guards/auth.guard';

const routes: Routes = [
  {
    path: 'merchant/dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'merchant/home',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
