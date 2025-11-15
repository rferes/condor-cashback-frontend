// login-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreGroupListComponent } from '../store-group-list/components/store-group-list.component';
import { StoreGroupViewComponent } from '../store-group-view/components/store-group-view.component';
import { AuthGuard } from 'src/app/utils/guards/auth.guard';

const routes: Routes = [
  {
    path: 'merchant/store-group-list',
    component: StoreGroupListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'merchant/store-group-view/:id',
    component: StoreGroupViewComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreGroupRoutingModule {}
