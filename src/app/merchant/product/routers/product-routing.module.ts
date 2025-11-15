// login-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from '../product-list/components/product-list.component';
import { ProductViewComponent } from '../product-view/components/product-view.component';
import { AuthGuard } from 'src/app/utils/guards/auth.guard';

const routes: Routes = [
  {
    path: 'merchant/product-list',
    component: ProductListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'merchant/product-view/:id',
    component: ProductViewComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
