// login-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CouponListComponent } from 'src/app/coupon/coupon-list/components/coupon-list.component';
import { CouponViewComponent } from 'src/app/coupon/coupon-view/components/coupon-view.component';
import { AuthGuard } from 'src/app/utils/guards/auth.guard';

const routes: Routes = [
  {
    path: 'reports/coupon-list',
    component: CouponListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'reports/coupon-view/:id',
    component: CouponViewComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CouponRoutingModule {}
