// login-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionListComponent } from '../collection-list/components/collection-list.component';
import { CollectionViewComponent } from '../collection-view/components/collection-view.component';

import { AuthGuard } from 'src/app/utils/guards/auth.guard';

const routes: Routes = [
  {
    path: 'merchant/collection-list',
    component: CollectionListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'merchant/collection-view/:id',
    component: CollectionViewComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CollectionRoutingModule {}
