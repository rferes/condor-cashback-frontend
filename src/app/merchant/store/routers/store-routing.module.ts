// login-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreListComponent } from '../store-list/components/store-list.component';
import { StoreViewComponent } from '../store-view/components/store-view.component';
import { AuthGuard } from 'src/app/utils/guards/auth.guard';

const routes: Routes = [
  {
    path: 'merchant/store-list',
    component: StoreListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'merchant/store-view/:id',
    component: StoreViewComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreRoutingModule {}
